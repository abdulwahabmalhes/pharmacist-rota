<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RoleMiddleware
{
    public function handle(Request $request, Closure $next, ...$roles): Response
    {
        $user = $request->user();

        if (!$user) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }

        // Check if user's role is in the allowed roles
        if (!in_array($user->role, $roles)) {
            return response()->json(['message' => 'Unauthorized. Required role: ' . implode(' or ', $roles)], 403);
        }

        return $next($request);
    }
}
