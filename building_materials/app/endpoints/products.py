from fastapi import APIRouter, Depends, HTTPException
from typing import List

from app.auth import get_current_user
from ..models import Products, Suppliers
from ..schemas import Product, ProductCreate, ProductUpdate, User

router = APIRouter(prefix="/products", tags=["products"])

# Получение списка всех товаров


@router.get("/")
async def list_products(current_user: User = Depends(get_current_user)):
    if current_user.role not in ["admin", "purchaser"]:
        raise HTTPException(
            status_code=403,
            detail="Only admin and purchasers can create products"
        )

    return await Products.select(
        Products.all_columns(),  # все поля продукта
        Products.supplier_id.all_columns()  # все поля поставщика
    ).order_by(Products.id).run()

# Создание нового товара


@router.post("/")
async def create_product(
    product_data: ProductCreate,
    current_user: User = Depends(get_current_user)
):
    if current_user.role not in ["admin", "purchaser"]:
        raise HTTPException(
            status_code=403,
            detail="Only admin and purchasers can create products"
        )

    # Проверяем существование поставщика
    supplier = await Suppliers.objects().where(Suppliers.id == product_data.supplier_id).first()
    if not supplier:
        raise HTTPException(
            status_code=404,
            detail="Supplier not found"
        )

    product_dict = product_data.dict(exclude_unset=True)
    await Products(**product_dict).save()
    return {'details': "ok"}

# Получение конкретного товара


@router.get("/{product_id}", response_model=Product)
async def get_product(product_id: int):
    product = await Products.objects().where(Products.id == product_id).first()
    if not product:
        raise HTTPException(
            status_code=404,
            detail="Product not found"
        )
    return product


# Обновление товара
@router.put("/{product_id}", response_model=Product)
async def update_product(
    product_id: int,
    product_data: ProductUpdate,
    current_user: User = Depends(get_current_user)
):
    if current_user.role not in ["admin", "purchaser"]:
        raise HTTPException(
            status_code=403,
            detail="Only admin and purchasers can update products"
        )

    product = await Products.objects().where(Products.id == product_id).first()
    if not product:
        raise HTTPException(
            status_code=404,
            detail="Product not found"
        )

    update_data = product_data.dict(exclude_unset=True, exclude_none=True)

    # Проверяем поставщика если он указан для обновления
    if 'supplier_id' in update_data:
        supplier = await Suppliers.objects().where(Suppliers.id == update_data['supplier_id']).first()
        if not supplier:
            raise HTTPException(
                status_code=404,
                detail="Supplier not found"
            )

    if update_data:
        await Products.update().where(Products.id == product_id).values(**update_data)

    updated_product = await Products.objects().where(Products.id == product_id).first()
    return updated_product

# Удаление товара


@router.delete("/{product_id}")
async def delete_product(
    product_id: int,
    current_user: User = Depends(get_current_user)
):
    if current_user.role != "admin":
        raise HTTPException(
            status_code=403,
            detail="Only admin can delete products"
        )

    product = await Products.objects().where(Products.id == product_id).first()
    if not product:
        raise HTTPException(
            status_code=404,
            detail="Product not found"
        )

    await Products.delete().where(Products.id == product_id).run()
    return {"message": "Product deleted successfully"}
