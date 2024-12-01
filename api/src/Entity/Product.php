<?php
namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use Doctrine\ORM\Mapping as ORM;

// Expose this entity as an API resource (if using API Platform)
#[ORM\Entity]
#[ApiResource]
class Product
{
    // The primary key (unique ID for the product)
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: "integer")]
    private ?int $id = null;

    // Name of the product (e.g., "iPhone 14", "T-Shirt")
    #[ORM\Column(type: "string", length: 255)]
    private ?string $name = null;

    // Detailed description of the product
    #[ORM\Column(type: "text")]
    private ?string $description = null;

    // Price of the product
    #[ORM\Column(type: "float")]
    private ?float $price = null;

    // Timestamp of product creation
    #[ORM\Column(type: "datetime")]
    private ?\DateTimeInterface $createdAt = null; // Prevents a product from existing without a category

    // Relationship: Each Product must belong to one Category
    #[ORM\ManyToOne(targetEntity: Category::class, inversedBy: "products")]
    #[ORM\JoinColumn(nullable: false)]
    private ?Category $category = null;

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

    // Getter and setter for 'description'
    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(string $description): self
    {
        $this->description = $description;

        return $this;
    }

    // Getter and setter for 'price'
    public function getPrice(): ?float
    {
        return $this->price;
    }

    public function setPrice(float $price): self
    {
        $this->price = $price;

        return $this;
    }

    // Getter and setter for 'createdAt'
    public function getCreatedAt(): ?\DateTimeInterface
    {
        return $this->createdAt;
    }

    public function setCreatedAt(\DateTimeInterface $createdAt): self
    {
        $this->createdAt = $createdAt;

        return $this;
    }

    // Getter and setter for 'category'
    public function getCategory(): ?Category
    {
        return $this->category;
    }

    public function setCategory(?Category $category): self
    {
        $this->category = $category;

        return $this;
    }
}
