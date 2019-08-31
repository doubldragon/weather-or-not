<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;

class AppController extends AbstractController
{
    /**
     * @Route("/", name="home")
     */
    public function index()
    {
        return $this->render('app/index.html.twig', [
            'controller_name' => 'AppController',
        ]);
    }

    /**
     * @Route('/api/weather/formats', name="getWeatherFormats")
     */
    public function getWeatherFormats() {
        //Under normal circumstances, this information would be contained in the database and editable via dashboard
        return new JsonResponse([
            "01d" => [
                "icon" => "fa-sun",
                "iconColor" => "",
                "bgColor" => "",
                "textColor" => ""
            ],
            "01n" => [
                "icon" => "fa-moon",
                "iconColor" => "",
                "bgColor" => "",
                "textColor" => ""
            ],
            "02d" => [
                "icon" => "fa-cloud-sun",
                "iconColor" => "",
                "bgColor" => "",
                "textColor" => ""
            ],
            "02n" => [
                "icon" => "fa-cloud-moon",
                "iconColor" => "",
                "bgColor" => "",
                "textColor" => ""
            ],
            "03d" => [
                "icon" => "fa-cloud-sun",
                "iconColor" => "",
                "bgColor" => "",
                "textColor" => ""
            ],
            "03n" => [
                "icon" => "fa-cloud-moon",
                "iconColor" => "",
                "bgColor" => "",
                "textColor" => ""
            ],
            "04d" => [
                "icon" => "fa-cloud",
                "iconColor" => "",
                "bgColor" => "",
                "textColor" => ""
            ],
            "04n" => [
                "icon" => "fa-cloud",
                "bgColor" => "",
                "textColor" => ""
            ],
            "09d" => [
                "icon" => "fa-cloud-showers-heavy",
                "iconColor" => "",
                "bgColor" => "",
                "textColor" => ""
            ],
            "09n" => [
                "icon" => "fa-cloud-showers-heavy",
                "iconColor" => "",
                "bgColor" => "",
                "textColor" => ""
            ],
            "10d" => [
                "icon" => "fa-cloud-sun-rain",
                "iconColor" => "",
                "bgColor" => "",
                "textColor" => ""
            ],
            "10n" => [
                "icon" => "fa-cloud-moon-rain",
                "iconColor" => "",
                "bgColor" => "",
                "textColor" => ""
            ],
            "11d" => [
                "icon" => "fa-poo-storm",
                "iconColor" => "",
                "bgColor" => "",
                "textColor" => ""
            ],
            "11n" => [
                "icon" => "fa-poo-storm",
                "iconColor" => "",
                "bgColor" => "",
                "textColor" => ""
            ],
            "12d" => [
                "icon" => "fa-snowflake",
                "iconColor" => "",
                "bgColor" => "",
                "textColor" => ""
            ],
            "12n" => [
                "icon" => "fa-snowflake",
                "iconColor" => "",
                "bgColor" => "",
                "textColor" => ""
            ],
            "13d" => [
                "icon" => "fa-sun",
                "iconColor" => "",
                "bgColor" => "",
                "textColor" => ""
            ],
            "13n" => [
                "icon" => "fa-sun",
                "iconColor" => "",
                "bgColor" => "",
                "textColor" => ""
            ],
            "50d" => [
                "icon" => "fa-smog",
                "iconColor" => "",
                "bgColor" => "",
                "textColor" => ""
            ],
            "50n" => [
                "icon" => "fa-smog",
                "iconColor" => "",
                "bgColor" => "",
                "textColor" => ""
            ]
        ]);
    }
}
