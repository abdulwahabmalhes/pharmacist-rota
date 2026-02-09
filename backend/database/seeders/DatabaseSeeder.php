<?php

namespace Database\Seeders;

use App\Models\DailyAvailability;
use App\Models\Pharmacist;
use App\Models\Pharmacy;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Create demo users
        User::create([
            'name' => 'HR Admin',
            'email' => 'hr@demo.com',
            'password' => Hash::make('Password123!'),
            'role' => 'HR',
        ]);

        User::create([
            'name' => 'Manager User',
            'email' => 'manager@demo.com',
            'password' => Hash::make('Password123!'),
            'role' => 'Manager',
        ]);

        User::create([
            'name' => 'Ahmed Pharmacist',
            'email' => 'pharm@demo.com',
            'password' => Hash::make('Password123!'),
            'role' => 'Pharmacist',
        ]);

        // Create sample pharmacists
        $pharmacists = [
            ['full_name' => 'Ahmed Hassan', 'phone' => '+971501234567', 'home_area' => 'Dubai Marina', 'active' => true],
            ['full_name' => 'Sara Ali', 'phone' => '+971502345678', 'home_area' => 'JBR', 'active' => true],
            ['full_name' => 'Mohammed Khalid', 'phone' => '+971503456789', 'home_area' => 'Downtown Dubai', 'active' => true],
            ['full_name' => 'Fatima Omar', 'phone' => '+971504567890', 'home_area' => 'Business Bay', 'active' => true],
            ['full_name' => 'Ali Mahmoud', 'phone' => '+971505678901', 'home_area' => 'Deira', 'active' => true],
        ];

        foreach ($pharmacists as $pharmacist) {
            Pharmacist::create($pharmacist);
        }

        // Create sample pharmacies
        $pharmacies = [
            ['name' => 'Marina Pharmacy', 'area' => 'Dubai Marina', 'address' => 'Marina Walk, Shop 12', 'open_from' => '09:00', 'open_to' => '22:00', 'active' => true],
            ['name' => 'JBR Health Plus', 'area' => 'JBR', 'address' => 'The Walk, JBR', 'open_from' => '08:00', 'open_to' => '23:00', 'active' => true],
            ['name' => 'Downtown Wellness', 'area' => 'Downtown Dubai', 'address' => 'Dubai Mall, LG Floor', 'open_from' => '10:00', 'open_to' => '22:00', 'active' => true],
            ['name' => 'Business Bay Pharmacy', 'area' => 'Business Bay', 'address' => 'Bay Square, Building 1', 'open_from' => '09:00', 'open_to' => '21:00', 'active' => true],
            ['name' => 'Deira Medical', 'area' => 'Deira', 'address' => 'Al Rigga Road', 'open_from' => '08:00', 'open_to' => '24:00', 'active' => true],
            ['name' => 'Al Barsha Pharmacy', 'area' => 'Al Barsha', 'address' => 'Mall of Emirates', 'open_from' => '10:00', 'open_to' => '22:00', 'active' => true],
            ['name' => 'Jumeirah Wellness', 'area' => 'Jumeirah', 'address' => 'Jumeirah Beach Road', 'open_from' => '08:00', 'open_to' => '20:00', 'active' => true],
            ['name' => 'Silicon Oasis Pharmacy', 'area' => 'Silicon Oasis', 'address' => 'DSO Main Road', 'open_from' => '09:00', 'open_to' => '21:00', 'active' => true],
            ['name' => 'Sports City Medical', 'area' => 'Sports City', 'address' => 'Victory Heights Plaza', 'open_from' => '09:00', 'open_to' => '20:00', 'active' => true],
            ['name' => 'Motor City Pharmacy', 'area' => 'Motor City', 'address' => 'First Avenue Mall', 'open_from' => '10:00', 'open_to' => '21:00', 'active' => true],
        ];

        foreach ($pharmacies as $pharmacy) {
            Pharmacy::create($pharmacy);
        }

        // Create sample availability for today
        $today = now()->format('Y-m-d');
        $statuses = ['Available', 'Available', 'Available', 'Off', 'Available'];

        foreach (Pharmacist::all() as $index => $pharmacist) {
            DailyAvailability::create([
                'date' => $today,
                'pharmacist_id' => $pharmacist->id,
                'status' => $statuses[$index] ?? 'Available',
            ]);
        }
    }
}
