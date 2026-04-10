<?php
/**
 * routes/api.php — Laravel API Routes
 * UCC IT Department PWA
 *
 * Authors: Marsha-Ann Genus (20233913) & Tajay Thompson (20205199)
 * Module:  ITT307 Internet Authoring II — Spring 2026
 *
 * Place this file at:  routes/api.php  inside your Laravel project.
 *
 * Endpoints:
 *   GET  /api/courses   → returns all courses as JSON (used by app.js)
 *   GET  /api/staff     → returns all staff as JSON (optional enhancement)
 */

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\DB;

/*
|--------------------------------------------------------------------------
| GET /api/courses
| Returns all rows from the `courses` table ordered by year, semester, id.
| app.js fetches this on page load; falls back to local array if it fails.
|--------------------------------------------------------------------------
*/
Route::get('/courses', function () {
    try {
        $courses = DB::table('courses')
            ->orderBy('year')
            ->orderBy('semester')
            ->orderBy('id')
            ->get([
                'id',
                'code',
                'name',
                'description',
                'prerequisite',
                'credits',
                'year',
                'semester'
            ]);

        return response()->json($courses, 200, [
            'Content-Type'                => 'application/json',
            'Access-Control-Allow-Origin' => '*',          /* Allow PWA requests */
            'Cache-Control'               => 'max-age=3600' /* Cache for 1 hour  */
        ]);

    } catch (\Exception $e) {
        return response()->json([
            'error'   => 'db_error',
            'message' => 'Unable to retrieve courses at this time.'
        ], 500);
    }
});

/*
|--------------------------------------------------------------------------
| GET /api/staff
| Optional: returns staff list as JSON.
| Useful if you later store staff in the DB rather than a JS array.
|--------------------------------------------------------------------------
*/
Route::get('/staff', function () {
    try {
        $staff = DB::table('staff')
            ->orderBy('id')
            ->get([
                'id',
                'name',
                'role',
                'phone',
                'email',
                'initials'
            ]);

        return response()->json($staff, 200, [
            'Content-Type'                => 'application/json',
            'Access-Control-Allow-Origin' => '*'
        ]);

    } catch (\Exception $e) {
        return response()->json([
            'error'   => 'db_error',
            'message' => 'Unable to retrieve staff at this time.'
        ], 500);
    }
});

/*
|--------------------------------------------------------------------------
| POST /api/contact
| Optional: receive the email form data server-side (alternative to Gmail URL).
|--------------------------------------------------------------------------
*/
Route::post('/contact', function (Request $request) {
    $validated = $request->validate([
        'name'    => 'required|string|max:120',
        'from'    => 'required|email|max:200',
        'subject' => 'required|string|max:200',
        'body'    => 'required|string|max:2000',
    ]);

    /* Log to database or send via Laravel Mail here */
    /* Example: Mail::to('ithod@ucc.edu.jm')->send(new ContactMail($validated)); */

    return response()->json([
        'success' => true,
        'message' => 'Your message has been sent.'
    ], 200);
});