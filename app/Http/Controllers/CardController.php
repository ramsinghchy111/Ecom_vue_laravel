<?php

namespace App\Http\Controllers;

use App\Models\Card;
use App\Models\Column;
use Illuminate\Http\Request;

class CardController extends Controller
{
    public function index(Column $column)
    {
        return $column->cards;
    }

    public function store(Request $request, Column $column)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
        ]);

        $card = $column->cards()->create($request->all());
        return response()->json($card, 201);
    }

    public function update(Request $request, Card $card)
    {
        $card->update($request->all());
        return response()->json($card);
    }

    public function destroy(Card $card)
    {
        $card->delete();
        return response()->json(['message' => 'Card deleted successfully']);
    }
}
