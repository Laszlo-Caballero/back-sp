# Resumen de Cambios en la API: Manejo de Número de Mesa por Parámetro y Body

## 1. Contexto y Motivación
Anteriormente, el flujo de la aplicación obtenía el número de mesa (`nroMesa`) a través del token JWT del usuario autenticado (`JwtPayload`). Esto limitaba las operaciones a una única mesa preasignada en sesión.

Para dar mayor flexibilidad al sistema, se refactorizó la API para que **el número de mesa se envíe explícitamente como `string`**:
- **Por URL / Path Param (`:nroMesa`)** como `string` (sin parseadores ni restricciones de número).
- **Por Body (`nroMesa: string`)** en el registro de votaciones (`@IsString()`).
- Se desacopló `nroMesa` del JWT y del proceso de autenticación.
- Se creó un módulo dedicado para consultar información de mesas (`MesaModule`).

---

## 2. Detalle de Archivos y Cambios Realizados

### A. Interfaces (`src/common/interfaces/interface.ts`)
- **`JwtPayload`**: Se removió la propiedad `nroMesa`.
```typescript
// Antes
export interface JwtPayload {
  dni: string;
  nroMesa: string;
  iat: number;
}

// Ahora
export interface JwtPayload {
  dni: string;
  iat: number;
}
```

---

### B. Entidades (`src/common/db/`)
- **`Personero` (`personero.entity.ts`)** y **`Mesa` (`mesa.entity.ts`)**:
  - Se corrigió y sincronizó la relación **1 a 1 (`@OneToOne`)**:
    - `Personero` tiene `@OneToOne(() => Mesa, (mesa) => mesa.personero) mesa: Mesa;`.
    - `Mesa` tiene `@OneToOne(() => Personero, (personero) => personero.mesa) @JoinColumn({ name: 'DNI_Personero' }) personero: Personero;`.

---

### C. Módulo de Autenticación (`src/modules/auth/`)
- **`auth.service.ts`**:
  - Se eliminó la dependencia de cargar la relación `mesa` en la consulta del personero durante el login.

---

### D. Módulo de Votos (`src/modules/votos/`)

#### 1. DTO de Registro (`dto/registrar-votos.dto.ts`)
- Se agregó el campo `nroMesa` obligatorio validado únicamente como `string` (`@IsString()`):
```typescript
export class RegistroVotosDto {
  @IsInt()
  totalCiudadanos: number;

  @IsInt()
  votosBlanco: number;

  @IsInt()
  votosNulos: number;

  @IsInt()
  votosImpugnados: number;

  @IsInt()
  votosImpugnadosSp: number;

  @IsObject()
  votosPartidos: Record<string, number>;

  @IsString()
  nroMesa: string; // <-- STRING PURO EN BODY
}
```

#### 2. Controlador (`votos.controller.ts`)
Se actualizaron las rutas para recibir el número de mesa como parámetro de ruta directamente como `string` (sin `ParseIntPipe`):

| Endpoint Anterior | Endpoint Nuevo | Método | Parámetro / Origen | Tipo |
| :--- | :--- | :---: | :--- | :---: |
| `/votos/registrar` | `/votos/registrar` | `POST` | `nroMesa` en **Body (DTO)** | `string` |
| `/votos/ver-acta-cerrada` | `/votos/ver-acta-cerrada/:nroMesa` | `GET` | `nroMesa` en **Path Param** | `string` |
| `/votos/subir-actas` | `/votos/subir-actas/:nroMesa` | `POST` | `nroMesa` en **Path Param** | `string` |
| `/votos/get-actas` | `/votos/get-actas/:nroMesa` | `GET` | `nroMesa` en **Path Param** | `string` |

#### 3. Servicio (`votos.service.ts`)
- **`registrarVotos(votos, user)`**:
  - Extrae `nroMesa` directamente como `string` (`votos.nroMesa`).
  - Guarda en `EscrutinioMesa` y `VotosCandidato` usando `NumeroMesa: nroMesa`.
- **`verActaCerrada(nroMesa: string)`**:
  - Recibe `nroMesa` como `string` y consulta `EscrutinioMesa` por `where: { NumeroMesa: nroMesa }`.
- **`getActas(nroMesa: string)`**:
  - Consulta `ImagenesPlanillone` por `where: { NumeroMesa: nroMesa }`.
- **`subirActas(files, nroMesa: string)`**:
  - Guarda las actas subidas a Cloudinary asociándolas al `NumeroMesa: nroMesa`.

---

### E. Nuevo Módulo de Mesas (`src/modules/mesa/`)
Se añadió el módulo `MesaModule` para consultar la información de las mesas de votación.

- **Ruta**: `GET /mesa/:nroMesa`
- **Controlador (`mesa.controller.ts`)**:
```typescript
@Controller('mesa')
export class MesaController {
  constructor(private readonly mesaService: MesaService) {}

  @Get('/:nroMesa')
  getMesaByNro(@Param('nroMesa') nroMesa: string) {
    return this.mesaService.getMesaByNro(nroMesa);
  }
}
```
- **Servicio (`mesa.service.ts`)**:
  - Busca en la tabla `Mesas` por `Numero_Mesa: nroMesa` (sin transformaciones numéricas).
  - Retorna `404 Not Found` si no existe la mesa.
- **Registro Global**: Añadido a los `imports` de `AppModule` (`src/app.module.ts`).

---

## 3. Resumen Rápido de Endpoints

```http
### 1. Obtener datos de la mesa
GET /mesa/102030
Authorization: Bearer <TOKEN>

### 2. Registrar votos de una mesa (Body)
POST /votos/registrar
Authorization: Bearer <TOKEN>
Content-Type: application/json

{
  "totalCiudadanos": 250,
  "votosBlanco": 5,
  "votosNulos": 2,
  "votosImpugnados": 1,
  "votosImpugnadosSp": 0,
  "votosPartidos": {
    "1": 40,
    "2": 35
  },
  "nroMesa": "102030"
}

### 3. Verificar si el acta de una mesa está cerrada (Param)
GET /votos/ver-acta-cerrada/102030
Authorization: Bearer <TOKEN>

### 4. Subir fotos de actas para una mesa (Param + Form-data)
POST /votos/subir-actas/102030
Authorization: Bearer <TOKEN>
Content-Type: multipart/form-data
[files]

### 5. Obtener fotos de actas de una mesa (Param)
GET /votos/get-actas/102030
Authorization: Bearer <TOKEN>
```
