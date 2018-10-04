<?php

namespace WouterDeSchuyter\Application\Http\Handlers;

use Slim\Http\Request;
use Slim\Http\Response;
use WouterDeSchuyter\Domain\AccessLogs\AccessLogRepository;
use WouterDeSchuyter\Infrastructure\View\ViewAwareInterface;
use WouterDeSchuyter\Infrastructure\View\ViewAwareTrait;

class StatsHandler implements ViewAwareInterface
{
    use ViewAwareTrait;

    /**
     * @var AccessLogRepository
     */
    private $accessLogRepository;

    /**
     * @param AccessLogRepository $accessLogRepository
     */
    public function __construct(AccessLogRepository $accessLogRepository)
    {
        $this->accessLogRepository = $accessLogRepository;
    }

    /**
     * @return string
     */
    public function getTemplate(): string
    {
        return 'pages/stats.html.twig';
    }

    /**
     * @param Request $request
     * @param Response $response
     * @return Response
     */
    public function __invoke(Request $request, Response $response): Response
    {
        $responseCodesPerHourLastDay = $this->responseCodesPerHourLastDay();
        $responseCountLast7Days = $this->responseCountLast7Days();
        $visitsLastDay = $this->accessLogRepository->visitsLast(1);
        $uniqueVisitsLastDay = $this->accessLogRepository->uniqueVisitsLast(1);
        $uniqueCountriesLastDay = $this->accessLogRepository->uniqueCountriesLast(1);
        $visitsLastWeek = $this->accessLogRepository->visitsLast(7);
        $uniqueVisitsLastWeek = $this->accessLogRepository->uniqueVisitsLast(7);
        $uniqueCountriesLastWeek = $this->accessLogRepository->uniqueCountriesLast(7);

        $data = [];
        $data['responseCodesPerHourLastDay'] = $responseCodesPerHourLastDay;
        $data['responseCountLast7Days'] = $responseCountLast7Days;
        $data['visitsLastDay'] = $visitsLastDay;
        $data['uniqueVisitsLastDay'] = $uniqueVisitsLastDay;
        $data['uniqueCountriesLastDay'] = $uniqueCountriesLastDay;
        $data['visitsLastWeek'] = $visitsLastWeek;
        $data['uniqueVisitsLastWeek'] = $uniqueVisitsLastWeek;
        $data['uniqueCountriesLastWeek'] = $uniqueCountriesLastWeek;

        return $this->render($response, $data);
    }

    /**
     * @return array
     */
    private function responseCodesPerHourLastDay(): array
    {
        $responseCodesPerHourLastDay = $this->accessLogRepository->responseCodesPerHourLastDay();

        $responseCodesPerHourLastDayTmp = [];
        foreach ($responseCodesPerHourLastDay as $data) {
            if (!isset($responseCodesPerHourLastDayTmp[$data['hour']])) {
                $responseCodesPerHourLastDayTmp[$data['hour']] = [];
            }

            $responseCodesPerHourLastDayTmp[$data['hour']][] = [
                'status_code' => $data['status_code'],
                'count'       => $data['count'],
            ];
        }

        $responseCodesPerHourLastDay = [];
        for ($i = 0; $i <= 23; $i++) {
            $hour = $i;
            if (strlen($hour) === 1) {
                $hour = '0' . $hour;
            }

            $data = isset($responseCodesPerHourLastDayTmp[$hour]) ? $responseCodesPerHourLastDayTmp[$hour] : null;
            $hour = $hour . ':00';

            if (!isset($responseCodesPerHourLastDay[$hour])) {
                $responseCodesPerHourLastDay[$hour] = [];
            }

            if (!$data) {
                continue;
            }

            foreach ($data as $item) {
                $status = $item['status_code'];
                if (in_array($status, [200, 304])) {
                    $status = '200304';
                } elseif (in_array($status, [301, 302])) {
                    $status = '301302';
                } elseif (in_array($status, [400, 401, 403, 404])) {
                    $status = '400401403404';
                } elseif ($status >= 500) {
                    $status = '50x';
                }

                $responseCodesPerHourLastDay[$hour][$status] = $item['count'];
            }
        }

        $responseCodesPerHourLastDayTmp = [];
        $hour = date('H') . ':00';
        $i = 1;
        while (count($responseCodesPerHourLastDayTmp) < 24) {
            $data = $responseCodesPerHourLastDay[$hour];
            $data['hour'] = $hour;
            $responseCodesPerHourLastDayTmp[] = $data;
            $hour = date('H', strtotime('-' . $i++ . ' hour')) . ':00';
        }

        return array_reverse($responseCodesPerHourLastDayTmp);
    }

    /**
     * @return array
     */
    private function responseCountLast7Days(): array
    {
        $responseCountPerHourLast7Days = $this->accessLogRepository->responseCountPerHourLast7Days();

        $responseCountLast7Days = [];
        $avg = [];
        $avgPer = 12;

        foreach ($responseCountPerHourLast7Days as $responseCountPerHour) {
            $day = explode(' ', $responseCountPerHour['interval'])[0];
            $hour = explode(' ', $responseCountPerHour['interval'])[1];

            if ((int) $hour % $avgPer === 0) {
                $value = 0;
                if (count($avg) > 0) {
                    $value = array_sum($avg);
                }

                $avg = [];
                $responseCountLast7Days[] = [
                    'count'    => $value,
                    'interval' => $day . ' ' . $hour . ':00',
                ];
            }

            $avg[] = $responseCountPerHour['count'];
        }

        return $responseCountLast7Days;
    }
}
