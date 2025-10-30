<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Column;
use App\Models\Card;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class CardController extends Controller
{
    // Create a new card in the provided column
    public function store(Request $request, Column $column)
    {
        $data = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'first_name' => 'nullable|string|max:255',
            'last_name' => 'nullable|string|max:255',
            'telephone' => 'nullable|string|max:50',
            'email' => 'nullable|email|max:255',
            'address' => 'nullable|string',
            'lead_value' => 'nullable|numeric',
            'assigned_to' => 'nullable|exists:users,id',
            'company_name' => 'nullable|string|max:255',
            'street' => 'nullable|string|max:255',
            'city' => 'nullable|string|max:255',
            'state' => 'nullable|string|max:255',
            'zip' => 'nullable|string|max:50',
            'country' => 'nullable|string|max:255',
            'websites' => 'nullable|array',
            'websites.*' => 'nullable|string',
        ]);

        // ensure websites stored as array/json
        if (isset($data['websites']) && !is_array($data['websites'])) {
            $data['websites'] = json_decode($data['websites'], true) ?: [];
        }

        // determine position: append to bottom of column
        $maxPos = $column->cards()->max('position');
        $data['position'] = is_null($maxPos) ? 0 : ($maxPos + 1);
        $data['column_id'] = $column->id;

        $card = null;
        DB::transaction(function () use (&$card, $data, $column) {
            $card = Card::create($data);
        });

        // eager load assigned user (if present) and column
        $card->load('assignedUser', 'column');

        return response()->json($card, 201);
    }

    // Update a card: details, move between columns, or reposition inside column
    public function update(Request $request, Card $card)
    {
        $data = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'first_name' => 'nullable|string|max:255',
            'last_name' => 'nullable|string|max:255',
            'telephone' => 'nullable|string|max:50',
            'email' => 'nullable|email|max:255',
            'address' => 'nullable|string',
            'lead_value' => 'nullable|numeric',
            'assigned_to' => ['nullable', Rule::exists('users', 'id')],
            'company_name' => 'nullable|string|max:255',
            'street' => 'nullable|string|max:255',
            'city' => 'nullable|string|max:255',
            'state' => 'nullable|string|max:255',
            'zip' => 'nullable|string|max:50',
            'country' => 'nullable|string|max:255',
            'websites' => 'nullable|array',
            'websites.*' => 'nullable|string',
            'column_id' => 'nullable|exists:columns,id',
            'position' => 'nullable|integer|min:0'
        ]);

        // Normalize websites
        if (isset($data['websites']) && !is_array($data['websites'])) {
            $data['websites'] = json_decode($data['websites'], true) ?: [];
        }

        DB::transaction(function () use ($card, $data) {
            $oldColumnId = $card->column_id;
            $oldPosition = $card->position;

            // If moving column or position provided, handle reposition logic
            $moving = array_key_exists('column_id', $data) || array_key_exists('position', $data);

            // Apply non-position/columnable updates
            $updatable = collect($data)->only([
                'title','description','first_name','last_name','telephone','email',
                'address','lead_value','assigned_to','company_name','street','city',
                'state','zip','country','websites'
            ])->toArray();

            if (!empty($updatable)) {
                $card->update($updatable);
            }

            if ($moving) {
                $toColumnId = $data['column_id'] ?? $card->column_id;
                $toIndex = $data['position'] ?? null;

                $this->moveCardAndReorder($card, $toColumnId, $toIndex);
            } else {
                // if no movement, but maybe position field only was updated (handled above)
                $card->save();
            }
        });

        $card->refresh()->load('assignedUser', 'column');
        return response()->json($card);
    }

    // Delete a card
    public function destroy(Card $card)
    {
        $card->delete();
        return response()->json(['deleted' => true]);
    }

    // Bulk sync positions (optional): expects payload like { columns: [{ id, cards: [{id, position}, ...] }, ...] }
    public function syncPositions(Request $request)
    {
        $payload = $request->validate([
            'columns' => 'required|array',
            'columns.*.id' => 'required|exists:columns,id',
            'columns.*.cards' => 'required|array',
            'columns.*.cards.*.id' => 'required|exists:cards,id',
            'columns.*.cards.*.position' => 'required|integer|min:0',
        ]);

        $toUpsert = [];
        foreach ($payload['columns'] as $col) {
            $colId = $col['id'];
            foreach ($col['cards'] as $c) {
                $toUpsert[] = [
                    'id' => $c['id'],
                    'column_id' => $colId,
                    'position' => $c['position']
                ];
            }
        }

        // Use upsert to efficiently update positions and column_id
        if (!empty($toUpsert)) {
            Card::upsert($toUpsert, ['id'], ['column_id', 'position']);
        }

        return response()->json(['ok' => true]);
    }

    // Helper: move card and reorder positions in source and destination columns
    protected function moveCardAndReorder(Card $card, int $toColumnId, ?int $toPosition = null)
    {
        $fromColumnId = $card->column_id;
        $cardId = $card->id;

        // Remove card from its current column's ordering (we'll renumber both columns)
        // Save card with new column_id (temporarily position null)
        $card->column_id = $toColumnId;
        // we'll assign a temp position, then reorder
        $card->position = $toPosition ?? 0;
        $card->save();

        // Reorder destination column: load all cards (including moved) and insert at toPosition
        $destCards = Card::where('column_id', $toColumnId)
            ->orderBy('position')
            ->get()
            ->filter(fn($c) => $c->id !== $cardId)
            ->values();

        // Build new order array
        $newList = [];
        $inserted = false;
        $insertIndex = is_null($toPosition) ? $destCards->count() : max(0, $toPosition);

        for ($i = 0; $i < $destCards->count() + 1; $i++) {
            if ($i === $insertIndex && !$inserted) {
                $newList[] = $card;
                $inserted = true;
            }
            if ($i < $destCards->count()) {
                $newList[] = $destCards[$i];
            }
        }

        // Persist positions
        foreach ($newList as $idx => $c) {
            Card::where('id', $c->id)->update(['position' => $idx, 'column_id' => $toColumnId]);
        }

        // Reorder source column (if different)
        if ($fromColumnId !== $toColumnId) {
            $srcCards = Card::where('column_id', $fromColumnId)->orderBy('position')->get();
            foreach ($srcCards as $idx => $sc) {
                Card::where('id', $sc->id)->update(['position' => $idx]);
            }
        }
    }
}
