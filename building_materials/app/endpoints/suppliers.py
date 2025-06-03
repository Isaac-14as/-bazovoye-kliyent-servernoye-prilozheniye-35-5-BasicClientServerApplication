from fastapi import APIRouter, Depends, HTTPException
from typing import List

from app.auth import get_current_user
from app.models import Products, Suppliers
from app.schemas import Product, Supplier, SupplierCreate, SupplierUpdate, User


router = APIRouter(prefix="/suppliers", tags=["suppliers"])

# Получение списка всех поставщиков


@router.get("/", response_model=List[Supplier])
async def list_suppliers():
    return await Suppliers.select().order_by(Suppliers.id).run()

# Создание нового поставщика


@router.post("/")
async def create_supplier(
    supplier_data: SupplierCreate,
    current_user: User = Depends(get_current_user)
):
    supplier_dict = supplier_data.dict(exclude_unset=True)
    await Suppliers(**supplier_dict).save()
    return {'details': "ok"}

# Получение конкретного поставщика


@router.get("/{supplier_id}", response_model=Supplier)
async def get_supplier(supplier_id: int):
    supplier = await Suppliers.objects().where(Suppliers.id == supplier_id).first()
    if not supplier:
        raise HTTPException(
            status_code=404,
            detail="Supplier not found"
        )
    return supplier

# Обновление поставщика


@router.put("/{supplier_id}", response_model=Supplier)
async def update_supplier(
    supplier_id: int,
    supplier_data: SupplierUpdate,
    current_user: User = Depends(get_current_user)
):
    supplier = await Suppliers.objects().where(Suppliers.id == supplier_id).first()
    if not supplier:
        raise HTTPException(
            status_code=404,
            detail="Supplier not found"
        )

    update_data = supplier_data.dict(exclude_unset=True, exclude_none=True)

    if update_data:
        await Suppliers.update().where(Suppliers.id == supplier_id).values(**update_data)

    updated_supplier = await Suppliers.objects().where(Suppliers.id == supplier_id).first()
    return updated_supplier

# Удаление поставщика


@router.delete("/{supplier_id}")
async def delete_supplier(
    supplier_id: int,
    current_user: User = Depends(get_current_user)
):
    supplier = await Suppliers.objects().where(Suppliers.id == supplier_id).first()
    if not supplier:
        raise HTTPException(
            status_code=404,
            detail="Supplier not found"
        )

    await Suppliers.delete().where(Suppliers.id == supplier_id).run()
    return {"message": "Supplier deleted successfully"}

# Получение товаров поставщика


@router.get("/{supplier_id}/products", response_model=List[Product])
async def get_supplier_products(supplier_id: int):
    supplier = await Suppliers.objects().where(Suppliers.id == supplier_id).first()
    if not supplier:
        raise HTTPException(
            status_code=404,
            detail="Supplier not found"
        )

    return await Products.select().where(Products.supplier == supplier_id).run()
