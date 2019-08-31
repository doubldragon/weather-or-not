<?php

namespace App\Repository;

use App\Entity\Favorite;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Common\Persistence\ManagerRegistry;

/**
 * @method Favorite|null find($id, $lockMode = null, $lockVersion = null)
 * @method Favorite|null findOneBy(array $criteria, array $orderBy = null)
 * @method Favorite[]    findAll()
 * @method Favorite[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class FavoriteRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Favorite::class);
    }

    public function getFavoritesByUser($userId) {
        return $this->createQueryBuilder('f')
            ->select('f.city_id','f.name')
            ->join('f.User', 'u')
            ->where('u.id = :userId')
            ->setParameter('userId', $userId)
            ->orderBy('f.name')
            ->getQuery()->getResult();
    }

    public function findCityByUser($cityId, $userId) {
        return $this->createQueryBuilder('f')
            ->join('f.User', 'u')
            ->where('u.id = :userId')
            ->andWhere('f.city_id = :cityId')
            ->setParameters([
                'userId' => $userId,
                'cityId' => $cityId,
            ])
            ->getQuery()->getResult();
    }

    // /**
    //  * @return Favorite[] Returns an array of Favorite objects
    //  */
    /*
    public function findByExampleField($value)
    {
        return $this->createQueryBuilder('f')
            ->andWhere('f.exampleField = :val')
            ->setParameter('val', $value)
            ->orderBy('f.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
        ;
    }
    */

    /*
    public function findOneBySomeField($value): ?Favorite
    {
        return $this->createQueryBuilder('f')
            ->andWhere('f.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */
}
