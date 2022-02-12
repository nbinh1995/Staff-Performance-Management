<?php

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

if (!function_exists('unique_slug')) {
    /**
     * @throws Exception
     */
    function unique_slug($string, $table, $column)
    {
        $slug = Str::slug($string);

        //get related slug
        $relatedSlugs = DB::table($table)->where($column, 'like', $slug . '%')->select($column)->get();

        if ($relatedSlugs->count() > 0) {
            $unique = $slug;
            $index = 1;
            while ($relatedSlugs->contains($column, $unique) && $index <= 20) {
                $unique = $slug . '-' . $index;
            }

            if ($index > 20) {
                throw new Exception('Can not create unique slug for ' . $string);
            } else {
                $slug = $unique;
            }
        }

        return $slug;
    }

}

if (!function_exists('is_valid_date')) {
    function is_valid_date($string, $format = 'Y-m-d')
    {
        try {
            $date = DateTime::createFromFormat($format, $string);
            return $date && $date->format($format) === $string;
        } catch (Exception $e) {
            return false;
        }
    }

}