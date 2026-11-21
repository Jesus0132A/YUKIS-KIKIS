/* =========================================================================
   YUKIS KIKIS · puestos.js  —  AQUÍ SE EDITAN LOS PUESTOS DEL MERCADO
   (es el único archivo que necesitas tocar para avisar si hoy estamos o no)

   Cada puesto tiene:
     id         → nombre interno único (sin espacios)
     day        → día de la semana: 0 Domingo · 1 Lunes · 2 Martes · 3 Miércoles · 4 Jueves · 5 Viernes · 6 Sábado
     market     → nombre del mercado o zona (agrupa los puestos del mismo lugar)
     name       → cómo se llama este puesto ("Puesto de arriba", "Puesto de abajo"…)
     where      → a la altura de qué calle/lugar está, para que el cliente lo encuentre
     opens      → hora de apertura, formato 24 h  ('18:00' = 6:00 PM)
     closes     → hora de cierre, formato 24 h    ('22:30' = 10:30 PM)
     maps       → (opcional) enlace de Google Maps de ese puesto
     available  → true = hoy sí nos instalamos · false = hoy NO (clima u otro imprevisto)
     note       → (opcional) mensaje propio para ese puesto, por ejemplo: 'Hoy no pudimos instalarnos por la lluvia'

   CÓMO AVISAR QUE HOY NO ESTAMOS EN UN PUESTO:
     cambia  available: true  →  available: false  de ese puesto, guarda y sube el archivo a GitHub.
     (cuando vuelvas a instalarte, regrésalo a true).

   Para agregar un puesto, copia un bloque { … }, pégalo y cambia sus datos.
   ========================================================================= */
window.YK_PUESTOS = [
  {
    id: 'sab-astros-arriba', day: 6,
    market: 'Av. de los Astros',
    name: 'Puesto de arriba',
    where: 'Av. de los Astros, en la parte de arriba (muy cerca de nuestro local)',
    opens: '18:00', closes: '22:30', maps: '',
    available: true, note: ''
  },
  {
    id: 'sab-astros-abajo', day: 6,
    market: 'Av. de los Astros',
    name: 'Puesto de abajo',
    where: 'Av. de los Astros, en la parte de abajo (muy cerca de nuestro local)',
    opens: '18:00', closes: '22:30', maps: '',
    available: true, note: ''
  },
  {
    id: 'dom-penitenciaria', day: 0,
    market: 'Penitenciaría',
    name: 'Puesto de la Penitenciaría',
    where: 'Mercado de la Penitenciaría, por la mañana',   // ← agrega aquí a la altura de qué calle: 'Mercado de la Penitenciaría, a la altura de …'
    opens: '08:00', closes: '14:00', maps: '',
    available: true, note: ''
  },
  {
    id: 'lun-mercado', day: 1,
    market: 'Mercado del lunes',
    name: 'Puesto del lunes',
    where: 'Ubicación por confirmar. ¡Pronto la compartimos aquí!',   // ← escribe aquí el mercado y a la altura de qué calle
    opens: '15:00', closes: '21:00', maps: '',
    available: true, note: ''
  }
  /* Ejemplo para agregar otro (quita los símbolos de comentario y cambia los datos):
  ,{
    id: 'mie-mercado', day: 3,
    market: 'Nombre del mercado',
    name: 'Puesto del miércoles',
    where: 'A la altura de …',
    opens: '16:00', closes: '21:00', maps: '',
    available: true, note: ''
  }
  */
];
