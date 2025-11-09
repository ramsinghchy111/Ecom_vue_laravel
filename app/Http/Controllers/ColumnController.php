<?php

namespace App\Http\Controllers;

use App\Models\Column;
use Illuminate\Http\Request;

class ColumnController extends Controller
{
    public function index()
    {
        return Column::with('cards')->get();
    }

    public function store(Request $request)
    {
        $column = Column::create([
            'title' => $request->title,
        ]);

        return response()->json($column, 201);
    }
}
