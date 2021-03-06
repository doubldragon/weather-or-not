<?php

namespace App\Controller;

use App\Entity\Favorite;
use http\Env\Request;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\DependencyInjection\Tests\Compiler\J;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use GuzzleHttp;

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
     * @Route("/api/user/favorites", methods={"GET"})
     */
    public function getUserFavorites() {
        $favorites = [];
        if ($this->getUser())
            $favorites = $this->getDoctrine()->getRepository(Favorite::class)->getFavoritesByUser($this->getUser()->getId());
        return new JsonResponse($favorites);
    }

    /**
     * @Route("/api/user/favorites/add", methods={"POST"})
     */
    public function addFavorite() {
        if ($this->getUser()) {
            $exists = $this->getDoctrine()->getRepository(Favorite::class)->findCityByUser($_POST["cityId"], $this->getUser()->getId());
            if (!$exists) {
                $fave = new Favorite();
                $fave->setCityId($_POST["cityId"]);
                $fave->setName($_POST["cityName"]);
                $fave->setUser($this->getUser());
                $this->getDoctrine()->getManager()->persist($fave);
                $this->getDoctrine()->getManager()->flush();
            }
        }
        return new JsonResponse("success", 200);
    }

    /**
     * @Route("/api/user/favorites/remove/{cityId}", methods={"POST"})
     */

    public function removeFavorite($cityId) {
        if ($this->getUser()) {
            $favorite = $this->getDoctrine()->getRepository(Favorite::class)->findCityByUser($cityId, $this->getUser()->getId());
            if($favorite)
                $this->getDoctrine()->getManager()->remove($favorite[0]);
            $this->getDoctrine()->getManager()->flush();
        }
        return new JsonResponse("success", 200);

    }

    /**
     * @Route("/api/openweather/{paramType}/{params}")
     */

    public function getDataFromOpenWeather($paramType, $params) {
        $response = [];
        $openKey = "58e92c763df5499a2c9ae20da806e2dc";
        if ($params) {
            $guzzle = new GuzzleHttp\Client();
            $urlString = "http://api.openweathermap.org/data/2.5/weather?units=imperial&us&appid=" . $openKey . "&";
            if ($paramType == "city") {
                $urlString .= "id=" . $params;
            }
            else if ($paramType == "latlng") {
                $coords = explode(" ", $params);
                $urlString .= "lat=" . $coords[0] . "&lon=" . $coords[1];
            }
            else if ($paramType == "bulk") {
                $urlString = "http://api.openweathermap.org/data/2.5/group?units=imperial&us&appid=" . $openKey . "&id=";
                $favorites = [];
                if ($this->getUser())
                    $favorites = $this->getDoctrine()->getRepository(Favorite::class)->getFavoritesByUser($this->getUser()->getId());
                else
                    return new JsonResponse([],200);
                $bulkList = "";
                $i=1;
                foreach($favorites as $fave) {
                    $bulkList .= $fave["city_id"];
                    if ($i < count($favorites))
                        $bulkList .= ",";
                    $i++;
                }
                $urlString .= $bulkList;
            }

            $response = $guzzle->request("GET", $urlString);
            $response = json_decode($response->getBody()->getContents());
        }
        return new JsonResponse($response);

    }

    /**
     * @Route("/api/geocode/{params}")
     */

    public function geocodeLocation($params) {
        $googleKey = "AIzaSyDrjLW5bzv-_BqozBVr8kG843fVJ8OI_xw";
        $urlString = "https://maps.googleapis.com/maps/api/geocode/json?key=" . $googleKey . "&address=" . $params;
        $guzzle = new GuzzleHttp\Client();
        $response = $guzzle->request("GET", $urlString);
        $response = json_decode($response->getBody()->getContents());
        return new JsonResponse($response);
    }

    /**
     * @Route("/api/weather/formats", name="getWeatherFormats")
     */
    public function getWeatherFormats() {

        //Under normal circumstances, this information would be contained in the database and editable via dashboard
        return new JsonResponse([
            "01d" => [
                "icon" => "fa-sun",
                "iconColor" => "#f0ec00",
                "bgColor" => "#0092ed",
                "textColor" => ""
            ],
            "01n" => [
                "icon" => "fa-moon",
                "iconColor" => "#ffffff",
                "bgColor" => "#080340",
                "textColor" => ""
            ],
            "02d" => [
                "icon" => "fa-cloud-sun",
                "iconColor" => "#ffffff",
                "bgColor" => "#3a8bbd",
                "textColor" => ""
            ],
            "02n" => [
                "icon" => "fa-cloud-moon",
                "iconColor" => "#ffffff",
                "bgColor" => "#080340",
                "textColor" => ""
            ],
            "03d" => [
                "icon" => "fa-cloud-sun",
                "iconColor" => "#ffffff",
                "bgColor" => "#3a8bbd",
                "textColor" => ""
            ],
            "03n" => [
                "icon" => "fa-cloud-moon",
                "iconColor" => "",
                "bgColor" => "#080340",
                "textColor" => ""
            ],
            "04d" => [
                "icon" => "fa-cloud",
                "iconColor" => "",
                "bgColor" => "#63696e",
                "textColor" => ""
            ],
            "04n" => [
                "icon" => "fa-cloud",
                "iconColor" => "",
                "bgColor" => "#080340",
                "textColor" => ""
            ],
            "09d" => [
                "icon" => "fa-cloud-showers-heavy",
                "iconColor" => "",
                "bgColor" => "#63696e",
                "textColor" => ""
            ],
            "09n" => [
                "icon" => "fa-cloud-showers-heavy",
                "iconColor" => "",
                "bgColor" => "#63696e",
                "textColor" => ""
            ],
            "10d" => [
                "icon" => "fa-cloud-sun-rain",
                "iconColor" => "",
                "bgColor" => "#aaaaaa",
                "textColor" => ""
            ],
            "10n" => [
                "icon" => "fa-cloud-moon-rain",
                "iconColor" => "",
                "bgColor" => "#cccccc",
                "textColor" => ""
            ],
            "11d" => [
                "icon" => "fa-poo-storm",
                "iconColor" => "",
                "bgColor" => "#63696e",
                "textColor" => ""
            ],
            "11n" => [
                "icon" => "fa-poo-storm",
                "iconColor" => "",
                "bgColor" => "#63696e",
                "textColor" => ""
            ],
            "13d" => [
                "icon" => "fa-snowflake",
                "iconColor" => "",
                "bgColor" => "#3a8bbd",
                "textColor" => ""
            ],
            "13n" => [
                "icon" => "fa-snowflake",
                "iconColor" => "",
                "bgColor" => "",
                "textColor" => ""
            ],
            "50d" => [
                "icon" => "fa-smog",
                "iconColor" => "",
                "bgColor" => "#63696e",
                "textColor" => ""
            ],
            "50n" => [
                "icon" => "fa-smog",
                "iconColor" => "",
                "bgColor" => "#63696e",
                "textColor" => ""
            ]
        ], 200);
    }


}
