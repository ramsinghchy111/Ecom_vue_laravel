<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Column;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ColumnController extends Controller
{
    // Return all columns with their cards
    public function index()
    {
        $columns = Column::with(['cards' => function($q) {
            $q->orderBy('position');
        }])->orderBy('order')->get();

        return response()->json($columns);
    }

    // Create a column
    public function store(Request $request)
    {
        $data = $request->validate([
            'title' => 'required|string|max:255',
            'order' => 'nullable|integer'
        ]);

        // default order to end
        if (!isset($data['order'])) {
            $max = Column::max('order');
            $data['order'] = is_null($max) ? 0 : ($max + 1);
        }

        $col = Column::create($data);
        return response()->json($col, 201);
    }

    // Update a column (title or order)
    public function update(Request $request, Column $column)
    {
        $data = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'order' => 'nullable|integer'
        ]);

        DB::transaction(function () use ($column, $data) {
            if (isset($data['order'])) {
                // If order provided, reorder other columns simply by shifting
                $target = (int) $data['order'];
                // shift columns at/after target up by 1
                Column::where('id', '<>', $column->id)
                    ->where('order', '>=', $target)
                    ->increment('order');

                $column->order = $target;
            }

            if (isset($data['title'])) $column->title = $data['title'];

            $column->save();
        });

        return response()->json($column->fresh());
    }

    // Delete a column (cards should be cascade-deleted if migration set)
    public function destroy(Column $column)
    {
        $column->delete();
        return response()->json(['deleted' => true]);
    }

    // Optional: bulk reorder columns (expects { columns: [{id, order}, ...] })
    public function reorder(Request $request)
    {
        $payload = $request->validate([
            'columns' => 'required|array',
            'columns.*.id' => 'required|exists:columns,id',
            'columns.*.order' => 'required|integer'
        ]);

        foreach ($payload['columns'] as $c) {
            Column::where('id', $c['id'])->update(['order' => $c['order']]);
        }

        return response()->json(['ok' => true]);
    }
}
