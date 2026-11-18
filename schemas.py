from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from typing import Literal
from pydantic import BaseModel, Field

class ClienteInput(BaseModel):
    id_cliente: str = Field(..., min_length=1, max_length=30)
    edad: int = Field(..., ge=18, le=100)
    ingresos_anuales: float = Field(..., ge=0)
    antiguedad_meses: int = Field(..., ge=0, le=600)
    saldo_cuenta: float = Field(..., ge=0)
    num_productos: int = Field(..., ge=1, le=10)
    tiene_tarjeta: bool
    nivel_estudios: Literal["Primaria", "Secundaria", "Grado", "Master", "Doctorado"]
    tipo_cuenta: Literal["Corriente", "Ahorro", "Nomina", "Inversion"]
    nivel_satisfaccion: Literal["Muy Bajo", "Bajo", "Medio", "Alto", "Muy Alto"]
    canal_preferido: Literal["App Movil", "Web", "Oficina", "Telefono", "Cajero Antiguo"]
class PrediccionOutput(BaseModel):
    id_cliente:str
    abandono: int
    probabilidad_abandono: float = Field(..., ge=0.0, le=1.0)
    nivel_riesgo: Literal['Bajo','Medio','Alto']
    accion_recomendada: str