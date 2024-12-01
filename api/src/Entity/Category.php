<?php
namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

// Expose this entity as an API resource (if using API Platform)
#[ORM\Entity]
#[ApiResource]
class Category
{
    // The primary key (unique ID for the category)
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: "integer")]
    private ?int $id = null;

    // Name of the category (e.g., "Electronics", "Clothing")
    #[ORM\Column(type: "string", length: 255)]
    private ?string $name = null;

    // Relationship: One Category can have many Products
    #[
        ORM\OneToMany(
            mappedBy: "category",
            targetEntity: Product::class,
            cascade: ["persist", "remove"]
        )
    ]
    private Collection $products;

    // Constructor initializes the products collection to manage relationships
    public function __construct()
    {
        $this->products = new ArrayCollection();
    }

    // Getter and setter for 'id'
    public function getId(): ?int
    {
        return $this->id;
    }

    // Getter and setter for 'name'
    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): self
    {
        $this->name = $name;

        return $this;
    }

    // Getter for related products
    public function getProducts(): Collection
    {
        return $this->products;
    }
}
