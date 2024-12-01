<?php
namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity]
#[ApiResource]
class Product
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: "integer")]
    private ?int $id = null;

    #[ORM\Column(type: "string", length: 255)]
    #[Assert\NotBlank(message: "Le nom du produit ne peut pas être vide")]
    #[
        Assert\Length(
            min: 2,
            max: 255,
            minMessage: "Le nom du produit doit contenir au moins {{ limit }} caractères",
            maxMessage: "Le nom du produit ne peut pas dépasser {{ limit }} caractères"
        )
    ]
    private ?string $name = null;

    #[ORM\Column(type: "text")]
    #[Assert\NotBlank(message: "La description ne peut pas être vide")]
    #[
        Assert\Length(
            min: 10,
            minMessage: "La description doit contenir au moins {{ limit }} caractères"
        )
    ]
    private ?string $description = null;

    #[ORM\Column(type: "float")]
    #[Assert\Positive(message: "Le prix doit être un nombre positif")]
    #[Assert\NotNull(message: "Le prix ne peut pas être vide")]
    private ?float $price = null;

    #[ORM\Column(type: "datetime")]
    private ?\DateTimeInterface $createdAt = null;

    #[ORM\ManyToOne(targetEntity: Category::class, inversedBy: "products")]
    #[ORM\JoinColumn(nullable: false)]
    #[Assert\NotNull(message: "Le produit doit appartenir à une catégorie")]
    private ?Category $category = null;

    public function __construct()
    {
        $this->createdAt = new \DateTime();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): self
    {
        $this->name = $name;
        return $this;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(string $description): self
    {
        $this->description = $description;
        return $this;
    }

    public function getPrice(): ?float
    {
        return $this->price;
    }

    public function setPrice(float $price): self
    {
        $this->price = $price;
        return $this;
    }

    public function getCreatedAt(): ?\DateTimeInterface
    {
        return $this->createdAt;
    }

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
