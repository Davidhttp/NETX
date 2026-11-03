/**
 * NETX · store.js
 * Capa de almacenamiento y lógica de negocio en cliente (simulando persistencia local con localStorage).
 * Cumple con las reglas de negocio del documento NETX-DOC-01 y ERS v1.1.
 */
(() => {
  'use strict';

  const STORAGE_KEYS = {
    SESSION: 'netx_session_user',
    MEMBERS: 'netx_members_data',
    RULES: 'netx_rules_data',
    MEETINGS: 'netx_meetings_data',
    REFERRALS: 'netx_referrals_data',
    ATTENDANCE: 'netx_attendance_data',
    NOTIFICATIONS: 'netx_notifications_data'
  };

  // Giros / Categorías empresariales predeterminadas
  const DEFAULT_CATEGORIES = [
    'Marketing y Publicidad',
    'IT / Desarrollo de Software',
    'Legal y Notarial',
    'Contabilidad y Finanzas',
    'Inmobiliaria y Bienes Raíces',
    'Recursos Humanos y Capacitación',
    'Seguros y Fianzas',
    'Arquitectura y Construcción',
    'Salud y Nutrición',
    'Servicios Financieros e Inversión',
    'Logística y Transporte',
    'Diseño y Branding'
  ];

  // Reglas predeterminadas del capítulo (RF-02)
  const DEFAULT_RULES = {
    cuotaReferidosSemanal: 2,           // HU-03: mínimo 2 referidos semanales
    inasistenciasPermitidas: 2,         // HU-04: tope máximo 2 inasistencias sin suplente
    duracionPitchSegundos: 120,         // HU-05: 2 minutos (120 s)
    duracionPresentacionMinutos: 10,   // HU-05: 10 minutos
    presentacionesPorReunion: 2,       // 2 ponencias centrales por sesión
    metaIngresoAnual: 1,               // 1 nuevo miembro incorporado por socio al año
    nombreCapitulo: 'Capítulo Morelia',
    sedeHabitual: 'Hotel Fiesta Inn Morelia - Salón Independencia',
    horarioHabitual: 'Martes 07:45 AM - 09:30 AM'
  };

  // Padrón inicial de miembros (basado en mockups del ERS)
  const DEFAULT_MEMBERS = [
    {
      id: 1,
      nombre: 'Diego Uriel Méndez Rodríguez',
      giro: 'Servicios Financieros e Inversión',
      empresa: 'Valora Capital',
      email: 'admin@netx.com',
      telefono: '443-120-4560',
      fechaIngreso: '2025-02-15',
      estatus: 'Activo', // Activo | Suspendido | Baja
      rol: 'Administrador',
      originador: 'Fundador',
      asistenciasConsecutivas: 18,
      faltasSinSuplente: 0,
      avatar: 'D'
    },
    {
      id: 2,
      nombre: 'Brayan Ramiro Reyes Cárdenas',
      giro: 'Diseño y Branding',
      empresa: 'Estudio Prisma',
      email: 'coordinador@netx.com',
      telefono: '443-234-5678',
      fechaIngreso: '2025-03-01',
      estatus: 'Activo',
      rol: 'Coordinador',
      originador: 'Diego Uriel Méndez Rodríguez',
      asistenciasConsecutivas: 14,
      faltasSinSuplente: 0,
      avatar: 'B'
    },
    {
      id: 3,
      nombre: 'Juan Pérez',
      giro: 'Marketing y Publicidad',
      empresa: 'Nexus Creativo',
      email: 'juan.perez@nexuscreativo.com',
      telefono: '443-223-4561',
      fechaIngreso: '2026-01-16',
      estatus: 'Activo',
      rol: 'Miembro',
      originador: 'Diego Uriel Méndez Rodríguez',
      asistenciasConsecutivas: 10,
      faltasSinSuplente: 0,
      avatar: 'J'
    },
    {
      id: 4,
      nombre: 'María González',
      giro: 'IT / Desarrollo de Software',
      empresa: 'CodePoint Solutions',
      email: 'maria.gonzalez@codepoint.mx',
      telefono: '443-223-4562',
      fechaIngreso: '2026-02-13',
      estatus: 'Activo',
      rol: 'Miembro',
      originador: 'Juan Pérez',
      asistenciasConsecutivas: 8,
      faltasSinSuplente: 0,
      avatar: 'M'
    },
    {
      id: 5,
      nombre: 'Pedro Rodríguez',
      giro: 'Legal y Notarial',
      empresa: 'Rodríguez & Asociados',
      email: 'pedro@rodriguez-legal.com',
      telefono: '443-223-4581',
      fechaIngreso: '2026-01-12',
      estatus: 'Suspendido',
      rol: 'Miembro',
      originador: 'Diego Uriel Méndez Rodríguez',
      asistenciasConsecutivas: 0,
      faltasSinSuplente: 2,
      avatar: 'P'
    },
    {
      id: 6,
      nombre: 'Ana Fernández',
      giro: 'Contabilidad y Finanzas',
      empresa: 'Fernández Consultores Fiscales',
      email: 'ana@fernandezfiscal.com',
      telefono: '443-223-3580',
      fechaIngreso: '2026-01-12',
      estatus: 'Baja', // Baja definitiva: su giro queda liberado
      rol: 'Miembro',
      originador: 'María González',
      asistenciasConsecutivas: 0,
      faltasSinSuplente: 3,
      avatar: 'A'
    },
    {
      id: 7,
      nombre: 'Luis Morales',
      giro: 'Inmobiliaria y Bienes Raíces',
      empresa: 'Bienes Raíces Premier',
      email: 'luis.morales@premierinmuebles.com',
      telefono: '443-223-4563',
      fechaIngreso: '2026-01-12',
      estatus: 'Activo',
      rol: 'Miembro',
      originador: 'Juan Pérez',
      asistenciasConsecutivas: 6,
      faltasSinSuplente: 1,
      avatar: 'L'
    },
    {
      id: 8,
      nombre: 'Sofía Castro',
      giro: 'Recursos Humanos y Capacitación',
      empresa: 'Talento y Liderazgo RH',
      email: 'sofia.castro@talentorh.mx',
      telefono: '443-223-4582',
      fechaIngreso: '2026-01-12',
      estatus: 'Activo',
      rol: 'Miembro',
      originador: 'Brayan Ramiro Reyes Cárdenas',
      asistenciasConsecutivas: 9,
      faltasSinSuplente: 0,
      avatar: 'S'
    },
    {
      id: 9,
      nombre: 'Carlos Hernández',
      giro: 'Seguros y Fianzas',
      empresa: 'Hernández Asesores Patrimoniales',
      email: 'carlos@hernandezseguros.mx',
      telefono: '443-223-3581',
      fechaIngreso: '2026-01-12',
      estatus: 'Suspendido',
      rol: 'Miembro',
      originador: 'Diego Uriel Méndez Rodríguez',
      asistenciasConsecutivas: 0,
      faltasSinSuplente: 2,
      avatar: 'C'
    }
  ];

  // Reuniones iniciales
  const DEFAULT_MEETINGS = [
    {
      id: 38,
      numero: 38,
      fecha: '2026-10-27',
      horaInicio: '08:00',
      horaFin: '09:30',
      sede: 'Hotel Fiesta Inn Morelia - Salón Independencia',
      estado: 'En curso', // Programada | En curso | Finalizada
      ordenDelDia: [
        '08:00 - Registro y networking libre matutino',
        '08:15 - Apertura formal por el Presidente del Capítulo',
        '08:25 - Presentaciones centrales de 10 min (2 ponentes titulares)',
        '08:45 - Rueda de pitches semanales de 2 min por socio',
        '09:10 - Intercambio de referidos y agradecimientos por negocio ganado',
        '09:25 - Cierre, avisos del coordinador y networking abierto'
      ],
      ponentesPrincipales: [
        { miembroId: 3, nombre: 'Juan Pérez', tema: 'Cómo posicionar tu marca en LinkedIn B2B' },
        { miembroId: 4, nombre: 'María González', tema: 'Transformación digital y automatización de procesos' }
      ],
      capacitacion: {
        tema: 'Estrategias de Venta Consultiva',
        instructor: 'Dr. Claudio Ernesto Florián Arenas'
      },
      invitados: [
        { nombre: 'Ing. Roberto Martínez', empresa: 'BioTech Bajío', invitadoPor: 'María González' },
        { nombre: 'Lic. Claudia Solís', empresa: 'Grupo Constructor Centro', invitadoPor: 'Juan Pérez' }
      ]
    },
    {
      id: 37,
      numero: 37,
      fecha: '2026-10-20',
      horaInicio: '08:00',
      horaFin: '09:30',
      sede: 'Hotel Fiesta Inn Morelia',
      estado: 'Finalizada',
      ordenDelDia: ['Apertura', 'Ponencias', 'Pitches', 'Referidos', 'Cierre'],
      ponentesPrincipales: [
        { miembroId: 7, nombre: 'Luis Morales', tema: 'Oportunidades de inversión en naves industriales' },
        { miembroId: 8, nombre: 'Sofía Castro', tema: 'Retención de talento clave en empresas medianas' }
      ],
      capacitacion: {
        tema: 'Gobernanza y ética en redes de negocios',
        instructor: 'David Heredia Tapia'
      },
      invitados: []
    }
  ];

  // Asistencia de la reunión actual (REU-38)
  const DEFAULT_ATTENDANCE = [
    { reunionId: 38, miembroId: 1, estado: 'Confirmada', tipo: 'Presente', horaRegistro: '07:55 AM', suplente: null, pitchRealizado: true, pitchTiempoSeg: 112 },
    { reunionId: 38, miembroId: 2, estado: 'Confirmada', tipo: 'Presente', horaRegistro: '07:58 AM', suplente: null, pitchRealizado: true, pitchTiempoSeg: 118 },
    { reunionId: 38, miembroId: 3, estado: 'Confirmada', tipo: 'Presente', horaRegistro: '08:01 AM', suplente: null, pitchRealizado: true, pitchTiempoSeg: 120 },
    { reunionId: 38, miembroId: 4, estado: 'Confirmada', tipo: 'Presente', horaRegistro: '08:04 AM', suplente: null, pitchRealizado: false, pitchTiempoSeg: 0 },
    { reunionId: 38, miembroId: 5, estado: 'Confirmada', tipo: 'Inasistencia', horaRegistro: '-', suplente: null, pitchRealizado: false, pitchTiempoSeg: 0 },
    { reunionId: 38, miembroId: 7, estado: 'Pendiente', tipo: 'Presente', horaRegistro: '08:12 AM', suplente: null, pitchRealizado: false, pitchTiempoSeg: 0 },
    { reunionId: 38, miembroId: 8, estado: 'Confirmada', tipo: 'Suplente', horaRegistro: '08:06 AM', suplente: 'Lic. Fernando Ortiz (Gerente RH)', pitchRealizado: true, pitchTiempoSeg: 105 },
    { reunionId: 38, miembroId: 9, estado: 'Confirmada', tipo: 'Inasistencia', horaRegistro: '-', suplente: null, pitchRealizado: false, pitchTiempoSeg: 0 }
  ];

  // Referidos y embudo comercial inicial (RF-08, RF-09)
  const DEFAULT_REFERRALS = [
    {
      id: 21,
      generadorId: 3,
      generadorNombre: 'Juan Pérez',
      receptorId: 4,
      receptorNombre: 'María González',
      prospectoNombre: 'Lic. Mario Soto',
      prospectoEmpresa: 'Distribuidora Bajío',
      prospectoTelefono: '443-555-1234',
      prospectoEmail: 'mario.soto@distbajio.com',
      giroRequerido: 'IT / Desarrollo de Software',
      necesidad: 'Desarrollo de sistema web a la medida para control de almacén e inventario.',
      estado: 'Referido', // Referido | Contacto | Reunión 1-a-1 | Oportunidad | Cotización | Ganado | Perdido
      montoGanado: 0,
      fechaRegistro: '2026-10-26',
      fechaActualizacion: '2026-10-26',
      esUrgente: true
    },
    {
      id: 22,
      generadorId: 4,
      generadorNombre: 'María González',
      receptorId: 7,
      receptorNombre: 'Luis Morales',
      prospectoNombre: 'Arq. Salvador Ramos',
      prospectoEmpresa: 'Corporativo Michoacán S.A.',
      prospectoTelefono: '443-777-9876',
      prospectoEmail: 'sramos@corpmich.mx',
      giroRequerido: 'Inmobiliaria y Bienes Raíces',
      necesidad: 'Búsqueda de oficinas corporativas de 350 m² en zona Altozano.',
      estado: 'Contacto',
      montoGanado: 0,
      fechaRegistro: '2026-10-24',
      fechaActualizacion: '2026-10-25',
      esUrgente: false
    },
    {
      id: 23,
      generadorId: 7,
      generadorNombre: 'Luis Morales',
      receptorId: 3,
      receptorNombre: 'Juan Pérez',
      prospectoNombre: 'Gabriela Monroy',
      prospectoEmpresa: 'Hotel & Suites Alameda',
      prospectoTelefono: '443-888-4321',
      prospectoEmail: 'gerencia@hotelalameda.com',
      giroRequerido: 'Marketing y Publicidad',
      necesidad: 'Rediseño de imagen corporativa y campaña digital para temporada decembrina.',
      estado: 'Reunión 1-a-1',
      montoGanado: 0,
      fechaRegistro: '2026-10-22',
      fechaActualizacion: '2026-10-25',
      esUrgente: true
    },
    {
      id: 24,
      generadorId: 8,
      generadorNombre: 'Sofía Castro',
      receptorId: 4,
      receptorNombre: 'María González',
      prospectoNombre: 'Ing. Daniel Valenzuela',
      prospectoEmpresa: 'Agroindustrias del Valle',
      prospectoTelefono: '443-444-1122',
      prospectoEmail: 'dvalenzuela@agrovalle.com',
      giroRequerido: 'IT / Desarrollo de Software',
      necesidad: 'Implementación de ERP e integración con facturación electrónica 4.0.',
      estado: 'Oportunidad',
      montoGanado: 0,
      fechaRegistro: '2026-10-20',
      fechaActualizacion: '2026-10-24',
      esUrgente: false
    },
    {
      id: 25,
      generadorId: 1,
      generadorNombre: 'Diego Uriel Méndez Rodríguez',
      receptorId: 8,
      receptorNombre: 'Sofía Castro',
      prospectoNombre: 'Lic. Patricia Rivas',
      prospectoEmpresa: 'Aceros y Perfiles del Centro',
      prospectoTelefono: '443-333-8899',
      prospectoEmail: 'privas@acerosdelcentro.com',
      giroRequerido: 'Recursos Humanos y Capacitación',
      necesidad: 'Reclutamiento especializado para 4 mandos medios y evaluación de clima laboral.',
      estado: 'Cotización',
      montoGanado: 0,
      fechaRegistro: '2026-10-18',
      fechaActualizacion: '2026-10-23',
      esUrgente: true
    },
    {
      id: 26,
      generadorId: 3,
      generadorNombre: 'Juan Pérez',
      receptorId: 4,
      receptorNombre: 'María González',
      prospectoNombre: 'CP. Arturo Medina',
      prospectoEmpresa: 'Cadena de Farmacias Moderna',
      prospectoTelefono: '443-111-2233',
      prospectoEmail: 'amedina@farmaciasmoderna.com',
      giroRequerido: 'IT / Desarrollo de Software',
      necesidad: 'Punto de venta y módulo de pedidos en línea completado con éxito.',
      estado: 'Ganado',
      montoGanado: 85000,
      fechaRegistro: '2026-10-10',
      fechaActualizacion: '2026-10-22',
      esUrgente: false
    }
  ];

  // Helper para leer/escribir JSON en localStorage
  const getItem = (key, defaultValue) => {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : defaultValue;
    } catch (e) {
      console.warn('Error leyendo localStorage', key, e);
      return defaultValue;
    }
  };

  const setItem = (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.warn('Error guardando en localStorage', key, e);
    }
  };

  // Inicialización de la base de datos local si no existe
  const initStore = () => {
    if (!localStorage.getItem(STORAGE_KEYS.MEMBERS)) {
      setItem(STORAGE_KEYS.MEMBERS, DEFAULT_MEMBERS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.RULES)) {
      setItem(STORAGE_KEYS.RULES, DEFAULT_RULES);
    }
    if (!localStorage.getItem(STORAGE_KEYS.MEETINGS)) {
      setItem(STORAGE_KEYS.MEETINGS, DEFAULT_MEETINGS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.REFERRALS)) {
      setItem(STORAGE_KEYS.REFERRALS, DEFAULT_REFERRALS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.ATTENDANCE)) {
      setItem(STORAGE_KEYS.ATTENDANCE, DEFAULT_ATTENDANCE);
    }
    if (!localStorage.getItem(STORAGE_KEYS.SESSION)) {
      // Usuario por defecto: Administrador (Diego) para que no haya pantalla en blanco
      setItem(STORAGE_KEYS.SESSION, DEFAULT_MEMBERS[0]);
    }
  };

  initStore();

  // Objeto público NetxStore
  window.NetxStore = {
    // ----------------------------------------------------
    // Sesión y Usuarios (M1: HU-01, HU-02)
    // ----------------------------------------------------
    getCurrentUser() {
      const user = getItem(STORAGE_KEYS.SESSION, null);
      if (!user) {
        // Asignar primer miembro como admin por omisión para navegar fluidamente
        const admin = DEFAULT_MEMBERS[0];
        this.setCurrentUser(admin);
        return admin;
      }
      return user;
    },

    setCurrentUser(user) {
      setItem(STORAGE_KEYS.SESSION, user);
      window.dispatchEvent(new CustomEvent('netx:user-changed', { detail: user }));
    },

    login(email, password) {
      const members = this.getMembers();
      const user = members.find(m => m.email.toLowerCase() === email.trim().toLowerCase());

      if (!user) {
        return { success: false, message: 'El correo electrónico no se encuentra registrado en el capítulo.' };
      }
      if (user.estatus === 'Baja') {
        return { success: false, message: 'La cuenta indicada se encuentra en estatus de Baja definitiva.' };
      }
      // Validación pedagógica de contraseña (simulada)
      if (password.trim().length < 4) {
        return { success: false, message: 'La contraseña ingresada es incorrecta o no cumple con la longitud mínima.' };
      }

      this.setCurrentUser(user);
      return { success: true, user };
    },

    logout() {
      localStorage.removeItem(STORAGE_KEYS.SESSION);
      window.location.href = 'login.html';
    },

    // ----------------------------------------------------
    // Categorías y Regla de Exclusividad (HU-07 / RN-MEM-01)
    // ----------------------------------------------------
    getCategories() {
      return [...DEFAULT_CATEGORIES];
    },

    /**
     * Valida si un giro comercial ya está ocupado por un miembro Activo.
     * @param {string} giro - Nombre del giro a verificar
     * @param {number|null} ignoreMemberId - ID del miembro que se está editando
     * @returns {{ disponible: boolean, ocupadoPor?: string }}
     */
    validarExclusividadGiro(giro, ignoreMemberId = null) {
      const members = this.getMembers();
      const giroNormalizado = giro.trim().toLowerCase();

      const ocupante = members.find(m =>
        m.id !== ignoreMemberId &&
        m.estatus === 'Activo' &&
        m.giro.trim().toLowerCase() === giroNormalizado
      );

      if (ocupante) {
        return {
          disponible: false,
          ocupadoPor: ocupante.nombre,
          empresa: ocupante.empresa
        };
      }
      return { disponible: true };
    },

    // ----------------------------------------------------
    // Miembros (M2: HU-06 a HU-10)
    // ----------------------------------------------------
    getMembers() {
      return getItem(STORAGE_KEYS.MEMBERS, DEFAULT_MEMBERS);
    },

    getMemberById(id) {
      const members = this.getMembers();
      return members.find(m => m.id === Number(id)) || null;
    },

    saveMember(memberData) {
      const members = this.getMembers();

      // Si es alta o edición con estatus 'Activo', validar exclusividad de giro
      if (memberData.estatus === 'Activo') {
        const check = this.validarExclusividadGiro(memberData.giro, memberData.id || null);
        if (!check.disponible) {
          throw new Error(`Violación de exclusividad de giro: '${memberData.giro}' ya está cubierto por el miembro activo ${check.ocupadoPor} (${check.empresa}).`);
        }
      }

      if (memberData.id) {
        // Edición (HU-08)
        const index = members.findIndex(m => m.id === Number(memberData.id));
        if (index === -1) throw new Error('Miembro no encontrado');
        members[index] = { ...members[index], ...memberData, fechaActualizacion: new Date().toISOString().split('T')[0] };
      } else {
        // Alta nueva (HU-06)
        const nextId = members.length > 0 ? Math.max(...members.map(m => m.id)) + 1 : 1;
        const initial = (memberData.nombre || 'U').trim().charAt(0).toUpperCase();
        const newMember = {
          id: nextId,
          asistenciasConsecutivas: 0,
          faltasSinSuplente: 0,
          avatar: initial,
          fechaIngreso: memberData.fechaIngreso || new Date().toISOString().split('T')[0],
          ...memberData
        };
        members.push(newMember);
      }

      setItem(STORAGE_KEYS.MEMBERS, members);
      window.dispatchEvent(new CustomEvent('netx:members-updated', { detail: members }));
      return true;
    },

    cambiarEstatusMiembro(id, nuevoEstatus, motivo = '') {
      const members = this.getMembers();
      const member = members.find(m => m.id === Number(id));
      if (!member) throw new Error('Miembro no encontrado');

      // Si pasa a Activo, verificar que su giro no haya sido tomado por otro
      if (nuevoEstatus === 'Activo') {
        const check = this.validarExclusividadGiro(member.giro, member.id);
        if (!check.disponible) {
          throw new Error(`No se puede activar: El giro '${member.giro}' ahora está ocupado por ${check.ocupadoPor}.`);
        }
      }

      member.estatus = nuevoEstatus;
      member.motivoCambioEstatus = motivo;
      member.fechaCambioEstatus = new Date().toISOString().split('T')[0];

      setItem(STORAGE_KEYS.MEMBERS, members);
      window.dispatchEvent(new CustomEvent('netx:members-updated', { detail: members }));
      return true;
    },

    // ----------------------------------------------------
    // Reglas del Capítulo (M1: HU-03, HU-04, HU-05)
    // ----------------------------------------------------
    getRules() {
      return getItem(STORAGE_KEYS.RULES, DEFAULT_RULES);
    },

    saveRules(newRules) {
      const merged = { ...this.getRules(), ...newRules };
      setItem(STORAGE_KEYS.RULES, merged);
      window.dispatchEvent(new CustomEvent('netx:rules-updated', { detail: merged }));
      return merged;
    },

    resetRules() {
      setItem(STORAGE_KEYS.RULES, DEFAULT_RULES);
      window.dispatchEvent(new CustomEvent('netx:rules-updated', { detail: DEFAULT_RULES }));
      return DEFAULT_RULES;
    },

    // ----------------------------------------------------
    // Reuniones y Asistencia (M3: HU-11 a HU-17)
    // ----------------------------------------------------
    getMeetings() {
      return getItem(STORAGE_KEYS.MEETINGS, DEFAULT_MEETINGS);
    },

    getMeetingById(id) {
      return this.getMeetings().find(m => m.id === Number(id)) || null;
    },

    saveMeeting(meetingData) {
      const meetings = this.getMeetings();
      if (meetingData.id) {
        const index = meetings.findIndex(m => m.id === Number(meetingData.id));
        if (index === -1) throw new Error('Reunión no encontrada');
        meetings[index] = { ...meetings[index], ...meetingData };
      } else {
        const nextId = meetings.length > 0 ? Math.max(...meetings.map(m => m.id)) + 1 : 1;
        const newMeeting = {
          id: nextId,
          numero: nextId,
          estado: 'Programada',
          invitados: [],
          ordenDelDia: DEFAULT_MEETINGS[0].ordenDelDia,
          ...meetingData
        };
        meetings.unshift(newMeeting);
      }
      setItem(STORAGE_KEYS.MEETINGS, meetings);
      window.dispatchEvent(new CustomEvent('netx:meetings-updated', { detail: meetings }));
      return true;
    },

    getAttendance(reunionId = 38) {
      const all = getItem(STORAGE_KEYS.ATTENDANCE, DEFAULT_ATTENDANCE);
      return all.filter(a => a.reunionId === Number(reunionId));
    },

    marcarAsistenciaMiembro(reunionId, miembroId, tipo = 'Presente', suplenteNombre = null) {
      let attendances = getItem(STORAGE_KEYS.ATTENDANCE, DEFAULT_ATTENDANCE);
      const index = attendances.findIndex(a => a.reunionId === Number(reunionId) && a.miembroId === Number(miembroId));
      const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      const registro = {
        reunionId: Number(reunionId),
        miembroId: Number(miembroId),
        estado: 'Pendiente', // El miembro marca desde móvil; queda pendiente de confirmación por el admin (HU-13, HU-14)
        tipo: tipo,
        horaRegistro: now,
        suplente: suplenteNombre,
        pitchRealizado: false,
        pitchTiempoSeg: 0
      };

      if (index >= 0) {
        attendances[index] = { ...attendances[index], ...registro };
      } else {
        attendances.push(registro);
      }

      setItem(STORAGE_KEYS.ATTENDANCE, attendances);
      window.dispatchEvent(new CustomEvent('netx:attendance-updated', { detail: attendances }));
      return registro;
    },

    confirmarAsistenciaAdmin(reunionId, miembroId, nuevoEstado, nuevoTipo = null) {
      let attendances = getItem(STORAGE_KEYS.ATTENDANCE, DEFAULT_ATTENDANCE);
      const index = attendances.findIndex(a => a.reunionId === Number(reunionId) && a.miembroId === Number(miembroId));

      if (index >= 0) {
        attendances[index].estado = nuevoEstado; // 'Confirmada' o 'Rechazada'
        if (nuevoTipo) attendances[index].tipo = nuevoTipo;
      } else {
        attendances.push({
          reunionId: Number(reunionId),
          miembroId: Number(miembroId),
          estado: nuevoEstado,
          tipo: nuevoTipo || 'Presente',
          horaRegistro: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          suplente: null,
          pitchRealizado: false,
          pitchTiempoSeg: 0
        });
      }

      setItem(STORAGE_KEYS.ATTENDANCE, attendances);
      window.dispatchEvent(new CustomEvent('netx:attendance-updated', { detail: attendances }));
      return true;
    },

    registrarPitch(reunionId, miembroId, tiempoSegundos) {
      let attendances = getItem(STORAGE_KEYS.ATTENDANCE, DEFAULT_ATTENDANCE);
      const item = attendances.find(a => a.reunionId === Number(reunionId) && a.miembroId === Number(miembroId));
      if (item) {
        item.pitchRealizado = true;
        item.pitchTiempoSeg = tiempoSegundos;
        setItem(STORAGE_KEYS.ATTENDANCE, attendances);
        window.dispatchEvent(new CustomEvent('netx:attendance-updated', { detail: attendances }));
      }
    },

    agregarInvitadoReunion(reunionId, invitado) {
      const meetings = this.getMeetings();
      const meeting = meetings.find(m => m.id === Number(reunionId));
      if (meeting) {
        if (!meeting.invitados) meeting.invitados = [];
        meeting.invitados.push(invitado);
        setItem(STORAGE_KEYS.MEETINGS, meetings);
        window.dispatchEvent(new CustomEvent('netx:meetings-updated', { detail: meetings }));
      }
    },

    // ----------------------------------------------------
    // Referidos y Embudo Comercial (M4: HU-18 a HU-22)
    // ----------------------------------------------------
    getReferrals() {
      return getItem(STORAGE_KEYS.REFERRALS, DEFAULT_REFERRALS);
    },

    /**
     * HU-19: Bloqueo de prospectos activos duplicados.
     * Verifica si ya existe un prospecto activo con el mismo nombre o empresa hacia el mismo receptor.
     */
    verificarProspectoDuplicado(receptorId, prospectoNombre, prospectoEmpresa, ignoreReferralId = null) {
      const referrals = this.getReferrals();
      const nom = (prospectoNombre || '').trim().toLowerCase();
      const emp = (prospectoEmpresa || '').trim().toLowerCase();

      // Estados activos (no terminados)
      const estadosActivos = ['Referido', 'Contacto', 'Reunión 1-a-1', 'Oportunidad', 'Cotización'];

      const duplicado = referrals.find(r =>
        r.id !== ignoreReferralId &&
        r.receptorId === Number(receptorId) &&
        estadosActivos.includes(r.estado) &&
        (
          (nom && r.prospectoNombre.trim().toLowerCase() === nom) ||
          (emp && r.prospectoEmpresa.trim().toLowerCase() === emp)
        )
      );

      if (duplicado) {
        return {
          esDuplicado: true,
          referidoExistente: duplicado
        };
      }
      return { esDuplicado: false };
    },

    saveReferral(refData) {
      // Validar duplicidad activa (HU-19)
      const checkDup = this.verificarProspectoDuplicado(
        refData.receptorId,
        refData.prospectoNombre,
        refData.prospectoEmpresa,
        refData.id || null
      );

      if (checkDup.esDuplicado) {
        const dup = checkDup.referidoExistente;
        throw new Error(
          `Bloqueo por prospecto duplicado (HU-19): El receptor ya tiene activo el prospecto "${dup.prospectoNombre} (${dup.prospectoEmpresa})" en estado "${dup.estado}".`
        );
      }

      const referrals = this.getReferrals();
      const today = new Date().toISOString().split('T')[0];

      if (refData.id) {
        const index = referrals.findIndex(r => r.id === Number(refData.id));
        if (index === -1) throw new Error('Referido no encontrado');
        referrals[index] = {
          ...referrals[index],
          ...refData,
          fechaActualizacion: today
        };
      } else {
        const nextId = referrals.length > 0 ? Math.max(...referrals.map(r => r.id)) + 1 : 1;
        const newRef = {
          id: nextId,
          fechaRegistro: today,
          fechaActualizacion: today,
          estado: 'Referido',
          montoGanado: 0,
          ...refData
        };
        referrals.unshift(newRef);
      }

      setItem(STORAGE_KEYS.REFERRALS, referrals);
      window.dispatchEvent(new CustomEvent('netx:referrals-updated', { detail: referrals }));
      return true;
    },

    avanzarEstadoReferido(id, nuevoEstado, montoGanado = 0) {
      const referrals = this.getReferrals();
      const item = referrals.find(r => r.id === Number(id));
      if (!item) throw new Error('Referido no encontrado');

      item.estado = nuevoEstado;
      item.fechaActualizacion = new Date().toISOString().split('T')[0];

      // HU-21: Si pasa a Ganado, registrar monto monetario > 0
      if (nuevoEstado === 'Ganado') {
        const montoNum = Number(montoGanado);
        if (isNaN(montoNum) || montoNum <= 0) {
          throw new Error('Para registrar un negocio como Ganado (GNC), debe ingresar un monto mayor a cero.');
        }
        item.montoGanado = montoNum;
      }

      setItem(STORAGE_KEYS.REFERRALS, referrals);
      window.dispatchEvent(new CustomEvent('netx:referrals-updated', { detail: referrals }));
      return item;
    },

    // ----------------------------------------------------
    // Métricas y Cálculos Generales (Dashboard HU-28)
    // ----------------------------------------------------
    getStats() {
      const members = this.getMembers();
      const referrals = this.getReferrals();
      const meetings = this.getMeetings();

      const miembrosActivos = members.filter(m => m.estatus === 'Activo').length;
      const reunionesTotales = meetings.length + 36; // Historial consolidado
      const referidosTotales = referrals.length + 1244; // Historial consolidado
      const negocioGanadoTotal = referrals
        .filter(r => r.estado === 'Ganado')
        .reduce((sum, r) => sum + (Number(r.montoGanado) || 0), 0);

      return {
        miembrosActivos,
        miembrosTotal: members.length,
        reunionesRealizadas: reunionesTotales,
        referidosGenerados: referidosTotales,
        negocioGanadoTotal: negocioGanadoTotal || 85000,
        ultimosReferidos: referrals.slice(0, 6)
      };
    }
  };
})();

