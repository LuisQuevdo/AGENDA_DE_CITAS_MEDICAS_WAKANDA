export interface Usuario {
  id_usuario: string;
  nombre: string;
  correo: string;
  rol: string;
  fecha_creacion: string;
}

export interface Paciente {
  id_paciente: string;
  nombre: string;
  dui: string;
  isss: string;
  nit: string;
  fecha_nacimiento: string;
  direccion: string;
  telefono: string;
  correo: string;
}

// Para crear
export type PacienteCreate = Omit<Paciente, 'id_paciente'>;

// Para actualizar
export type PacienteUpdate = Partial<Omit<Paciente, 'id_paciente'>>;

export interface Medico {
  id_medico?: string;
  nombre: string;
  correo: string | null;
  especialidad_id: string;
  consultorio_id?: string | null;
  dui: string;
  isss: string;
  nit: string | null;
  telefono?: string | null;
}

export interface Cita {
  id_cita?: string;
  paciente_id: string;
  medico_id?: string;
  fecha_hora: string;
  consultorio_id?: string;
  estado: string;
  notas: string;
}

export interface Especialidad {
    id_especialidad?: string;
    nombre: string;
    descripcion: string;
}

export interface Notificacion {
    id_notificacion?: string;
    cita_id?: string;
    tipo: string;
    contenido: string;
    fecha_envio: string;
    estado: string;
}

export interface Consultorio {
  id_consultorio?: string;
  numero: string;
  piso: number;
  equipamiento: string;
}

export interface Horario {
  id_horario: string;
  medico_id: string;
  consultorio_id: string | null;
  dia_semana: number; // 1 (lunes) a 7 (domingo)
  hora_inicio: string; // formato HH:mm:ss
  hora_fin: string;
}

// Tipo para creacion o actualización (sin id)
export type HorarioInput = Omit<Horario, 'id_horario'>;

export interface Factura {
  id_factura: string;
  cita_id: string;
  numero_factura: string;
  fecha_emision: string;
  nit_paciente: string;
  subtotal: number;
  iva: number;
  total: number;
}

export interface MetodoPago {
  id_metodo_pago?: number;
  nombre: string;
}

export interface Pago {
  id_pago: string;
  factura_id: string;
  monto: number;
  fecha_pago: string;
  metodo_pago_id: number;
  referencia: string;
}

export type PagoInput = Omit<Pago, 'id_pago' | 'fecha_pago'>;

export interface FacturaForm {
  cita_id: string;
  numero_factura: string;
  fecha_emision: string;
  nit_paciente: string;
  subtotal: string; // se convierte a number antes de enviar
  iva: string;      // se convierte a number antes de enviar
}

export interface Telefono {
  id_telefonos?: string;
  nombre: string;
  codigo_pais: string;
  numero: string;
}


export interface TelefonoInput {
  nombre: string;
  codigo_pais: string;
  numero: string;
}