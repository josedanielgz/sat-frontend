## NOTAS: Análisis del Frontend

El siguiente escrito es fruto de un análisis inicial de la estructura del
frontend de la aplicación, por el momento alojado en [este
enlace:](https://github.com/miguellara5/SAT-Frontend/tree/dev)

Algunas generalidades conocidas:

* **Framework**: se evidencia que es una aplicación construida en Angular dada
  la presencia de archivos de configuración como angular.json, app.module.ts,
  app.component.ts, y la convención de carpetas para componentes y módulos.

* Está mayormente escrita en Typescrit, debido a la presencia de los archivos
  de configuración tsconfig.json y tslint.json.

* La aplicación utiliza la biblioteca **NgRx** para la gestión de estado dentro
  de la aplicación, a juzgar por la presencia de los archivos reducer,
  app.reducers.ts, y archivos como auth.actions.ts/auth.reducer.ts. Esta básicamente es una
  implementación del modelo de Redux para el framework Angular.

### Estructura general

* **components:** Contiene la mayoría de los bloques de construcción
  reutilizables (componentes de presentación/UI) de la aplicación, como navbar,
  alert, loading, table, modal-chat, profile-card, y otros específicos de
  dominio como history-clinical o statistics-risk.

* **pages:** Contiene los componentes de nivel superior o contenedores que
  representan las vistas o rutas principales, organizados por tema (e.g.,
  activities, auth, course, risk-academic).

* **dashboard-**: Módulos y componentes específicos para diferentes roles de
  usuario, como dashboard-student, dashboard-wellness, dashboard-psychology, y
  dashboard-boss, indicando un sistema con permisos y vistas diferenciadas.

### Roles de Usuario y Áreas (Implícitas)

Se puede inferir una segmentación de la aplicación a través de nombres de los
módulos y guardias:

| Módulo/Carpeta       | Rol de Usuario/Área | Archivos Clave                                                |
|----------------------|---------------------|---------------------------------------------------------------|
| dashboard-student    | Estudiante          |  student.module.ts, student.guard.ts                |
| dashboard            | Profesor            |  teacher.module.ts, teacher.guard.ts            |
| dashboard-wellness   | Bienestar           |  wellness.module.ts, wellness.guard.ts              |
| dashboard-psychology | Psicología          |  psychology.module.ts                               |
| dashboard-boss       | Jefe/Administrador  |  boss.module.ts, boss.guard.ts, admin.guard.ts  |

#### Desgloce

El modelo de datos de la aplicación se encuentra en src/app/model/ y comprende las siguientes clases:

* risk.ts: Define la estructura de datos del objeto "Riesgo", que es el
  principal concepto del sistema.

  Se ubica en `src/app/model/risk.ts`

  Depende de la clase `User` importada de `src/app/model/auth.ts`

  Se definen múltiples interfaces de negocio para representar las respuestas de la API:

| Interfaz                 | Función en el Negocio                                                                                              | Campos Clave y Observaciones                                                                                                                                                                    |
|--------------------------|--------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Risk                     | Interfaz para la representación visual o resumen de un riesgo en el Frontend (UI).                                 | name, path, riskGlobal (puntuación general), icon, y una color: Function (cambio dinámico de color según el riesgo).                                                                |
| Postulation              | La entidad principal para la solicitud de un estudiante a una actividad o ayuda.                                   | student, postulator (ambos de tipo User), description, date, state (estado de la solicitud), isActive.                                                                                          |
| PostulationResponse      | Formato de respuesta para obtener una lista paginada de postulaciones.                                             | Contiene data (un array de Postulation[]) y totalPages.                                                                                                                                         |
| ResposeUpdatePostulation | Formato de respuesta para confirmar la actualización o gestión de una postulación.                                 | Campos genéricos de respuesta API: ok, msg.                                                                                                                                                     |
| Profit                   | La entidad para definir un Beneficio o Incentivo (ej. ayuda económica, beca).                                      | nombre, descripcion, fechaInicio/Final, semestre, y opcionalmente riesgo (el beneficio podría estar dirigido a estudiantes con un tipo de riesgo específico).                                   |
| RiskUFPS y ItemRisk      | Estructuras para el cálculo granular de un riesgo, sugiriendo que el puntaje de riesgo se compone de varios ítems. | RiskUFPS tiene nombre y puntaje compuestos por un array de items: ItemRisk[]. "UFPS" sugiere una entidad académica específica (quizás Universidad Francisco de Paula Santander).                |
| RiskResponse             | Respuesta de la API que incluye el detalle de los riesgos por ítems.                                               | Contiene riesgos (de tipo RiskUFPS[]) y el riesgoGlobal (puntuación general del estudiante).                                                                                                    |
| StatisticsRisk           | El objeto de entrada utilizado en el RiskService para solicitar estadísticas o listas.                      | Permite filtrar por risk, code, group, program, period y tiene un flag global? (Probablemente el indicador que diferencia si el servicio debe devolver estadísticas o la lista de estudiantes).        |
| StatisticsResponse       | Respuesta de la API que devuelve datos de conteo o resumen sobre los riesgos.                                      | Contiene data (un array de Statistics[]) con type y total.                                                                                                                                      |
| StudentsInRiskResponse   | Respuesta de la API que devuelve el detalle de los estudiantes que cumplen los criterios de riesgo.                | Contiene data (un array de User[]).                                                                                                                                                             |

* auth.ts y role.ts: Ambas clases actúan de forma complementaria para definir
  las estructuras para el usuario y sus permisos, fundamentales para gestionar los roles
  del sistema.

  El archivo auth.ts se ubica en `src/app/model/auth.ts`

La interfaz más importante presente en esta clase es `User` y tiene los siguientes campos:

| Campos de Identificación (Básico)    | Campos Académicos y de Riesgo (Específicos del Negocio)          | Campos Opcionales/Complementarios |
|--------------------------------------|------------------------------------------------------------------|-----------------------------------|
| _id (Identificador único)            | rol (Clave para autorización)                                    | foto?                             |
| documento (Número de identificación) | codigo? (Código de estudiante)                                   | sexo?                             |
| nombre, apellido                     | programa? (Carrera)                                              | tipodocument?                     |
| correo                               | fechaingreso?                                                    | direccion?                        |
| telefono                             | estado? (Estado académico: activo, inactivo, etc.)               | edad?                             |
|                                      | semestre?                                                        |                                   |
|                                      | creditosaprobados?                                               |                                   |
|                                      | creditostotales?                                                 |                                   |
|                                      | promedio?                                                        |                                   |
|                                      | promedioponderadoacomulado?                                      |                                   |
|                                      | riesgo? (Puntuación de riesgo, usada para la lógica de negocio). |                                   |
|                                      | ac012 (Determina si el alumno se encuentra cubierto por AC012)   |                                   |

  Las otras interfaces definidas son las siguientes:

  | Interfaz        | Propósito                                                                     | Campos Clave y Observaciones                                                                                                                                                                        |
|-----------------|-------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| UserAuth        | Objeto de Petición (Request) para el inicio de sesión.                        | Necesita documento y password. code? y role? son opcionales, sugiriendo que la API puede manejar múltiples tipos de login (ej. por código o documento) o que el rol se puede enviar en la petición. |
| AuthResponse    | Formato de Respuesta (Response) del backend tras un inicio de sesión exitoso. | token (JWT para las futuras peticiones), data: User (el objeto completo del usuario logueado), ok, msg.                                                                                             |
| UserResponse    | Formato de Respuesta para obtener un solo usuario (e.g., al buscar por ID).   | data: User, ok, msg.                                                                                                                                                                                |
| StudentResponse | Formato de Respuesta para obtener una lista de estudiantes.                   | data: User[] (un array de usuarios), lo que confirma que esta interfaz User se reutiliza para todos los roles (administradores, profesores, y estudiantes).                                         |

En el caso de `role.ts`, esta clase define interfaces que contienen información
relacionada con los diferentes tipos de usuario del sistema y sus actividades.
Por ejemplo, abarca horarios de trabajo y actividades asignadas. Las dos interfaces principales son:

| Interfaz     | Propósito                                                                    | Campos Clave y Observaciones                                                |   |
|--------------|------------------------------------------------------------------------------|-----------------------------------------------------------------------------|---|
| Role         | Define una categoría de usuario (ej. Estudiante, Jefe, Bienestar, Profesor). | _id (Identificador único), role (El nombre del rol, típicamente en String). |   |
| RoleResponse | El formato de respuesta de la API al obtener un único objeto Role.           | data: Role, ok, msg.                                                        |   |

Luego tenemos las siguientes interfaces complementarias.

| Interfaz         | Propósito                                                                                      | Campos Clave y Observaciones                                                                                                                                                                                                      |
|------------------|------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Schedule         | Define los tramos horarios de trabajo diarios.                                                 | morningStart/End y afternoonStart/End (tramos de tiempo en formato String, ej. "08:00", "12:00"). Esto permite diferenciar turnos. _id? y role? sugieren que este horario puede ser un objeto independiente relacionado a un rol. |
| RoleSchedule     | Asocia un rol con una definición de horario.                                                   | Combina el campo role: String con el objeto schedule: Schedule, usado para peticiones o lógica interna que necesita el horario de un rol.                                                                                         |
| ScheduleResponse | Respuesta de la API que obtiene el horario y, crucialmente, las reservas hechas en ese tiempo. | ok, msg, y un objeto data que contiene: schedule: Schedule (el horario definido) y reservations: String[] (una lista de slots de tiempo ya reservados, esencial para la funcionalidad de citas).                                  |

* activity.ts: Esta clase define el modelo para la gestión de actividades
  extracurriculares o de apoyo dentro del sistema. Es clave para el módulo que
  planea, ejecuta y registra la participación de los estudiantes en programas
  de intervención o bienestar. Dada la estructura del proyecto, este modelo es
  importado por el activity.service.ts y el reducer de NgRx

| Campo       | Tipo    | Requerido | Propósito Funcional y Observaciones                                                                                              |
|-------------|---------|-----------|----------------------------------------------------------------------------------------------------------------------------------|
| _id         | any     | Sí        | Identificador único de la actividad. Típicamente un ObjectId o UUID.                                                             |
| name        | String  | Sí        | Nombre de la actividad (ej. "Taller de Manejo del Estrés").                                                                      |
| date        | Date    | Sí        | Fecha y hora en que se lleva a cabo la actividad.                                                                                |
| place       | String  | Sí        | Lugar de realización de la actividad.                                                                                            |
| risk        | String  | Sí        | El tipo de riesgo al que está dirigida la actividad (ej. "Riesgo Académico" o "Riesgo Psicológico").                             |
| riskLevel   | String  | Sí        | El nivel de riesgo de los participantes objetivo (ej. "Alto", "Medio", "Bajo").                                                  |
| state       | Boolean | Sí        | Estado general de la actividad (true: Activa/Abierta, false: Finalizada/Cerrada).                                                |
| description | String  | Opcional  | Texto de descripción o detalles de la actividad.                                                                                 |
| counter     | Number  | Sí        | Clave. Podría ser el número de cupos disponibles, el número de inscritos, o el número de veces que se ha realizado la actividad. |
| asistance   | Boolean | Sí        | Crucial. Indica si se está llevando un registro de asistencia para este evento (true/false).                                     |
| loading     | Boolean | Opcional  | Flag interno de Frontend para indicar si la actividad está en proceso de guardado o actualización en la UI.                      |

* `notification.ts:` contiene las interfaces fundamentales para la emisión de
  notificaciones en la aplicación. Es utilizada para sincronizar con el backend
  cómo se almacenan, envían y presentan a los usuarios finales. Contiene los
  siguientes campos:

 
| Campo | Tipo | Requerido | Descripción y Funcionalidad |
| :--- | :--- | :--- | :--- |
| **`_id?`** | `any` | Opcional | Identificador único de la notificación en la base de datos (típicamente usado en MongoDB). |
| **`title`** | `String` | Sí | El título o encabezado de la notificación (ej. "Nueva Postulación Creada"). |
| **`date`** | `Date` | Sí | La marca de tiempo que indica cuándo se creó o envió la notificación. |
| **`isActive`** | `boolean` | Sí | **Crucial.** Indica el estado de la notificación. Generalmente `true` significa "no leída" o "pendiente", y `false` significa "leída" o "archivada". |
| **`url`** | `String` | Sí | La URL o ruta interna de la aplicación (Angular Router link) a la que debe navegar el usuario al hacer clic en la notificación. |
| **`codeReceiver`** | `String` | Sí | El código del usuario (estudiante o administrador/profesor) al que está dirigida la notificación. |
| **`codeTransmitter?`** | `String` | Opcional | El código del usuario que generó o envió la notificación. |
| **`roleTransmitter?`** | `String` | Opcional | El rol del usuario que envió la notificación (ej. "Bienestar" o "Psicología"), útil para filtros o visualización. |
  
* meetClinical.ts y meetPsychology.ts: Estas dos interfaces son la base del
  módulo de salud clínica y bienestar de la aplicación, definiendo el
  expediente Clínico de los estudiantes. Más específcamente, lleva rasto de los datos asociados con las citas o
  encuentros de bienestar y psicología.

  La primera de ellas es:

| Campo | Propósito Funcional |
| :--- | :--- |
| **`reasonConsultation`** | Motivo por el cual el estudiante busca ayuda o consulta (parte subjetiva). |
| **`generalIllness`** | Información sobre la enfermedad o molestia general reportada. |
| **`systemsReview`** | Revisión por sistemas (interrogatorio organizado), una técnica de evaluación médica. |
| **`heartRate`, `bloodPressure`, etc.** | Signos Vitales y Medidas Objetivas. Estos campos registran datos físicos clave como la Frecuencia Cardíaca, Tensión Arterial, Temperatura, Peso y Talla. |

Luego tenemos

| Campo | Propósito Funcional |
| :--- | :--- |
| **`reasonMeet`** | El motivo de la consulta o sesión psicológica. |
| **`currentProblem`** | Descripción detallada del problema o situación que motiva la atención. |
| **`diagnosis`** | El diagnóstico o la impresión diagnóstica del psicólogo (eje: ansiedad, depresión, problemas de adaptación). |
| **`psychotherapeuticApproach`** | La estrategia o enfoque terapéutico que se está utilizando con el estudiante (eje: Terapia Cognitivo-Conductual, Humanista, etc.). |
| **`forecast`** | El pronóstico del caso (la expectativa sobre la evolución de la situación). |                            |

### Funcionalidad de Negocio

La carpeta src/app/services contiene la lógica para la comunicación con backends o la gestión de datos.

* Autenticación y Autorización: Manejada por auth.service.ts y los archivos en
  guards (private.guard.ts, public.guard.ts, y los específicos de rol como
  student.guard.ts).

* Funcionalidades Clave: Existen servicios dedicados para áreas específicas:
    * risk.service.ts (Gestión de riesgos) 
    * activity.service.ts (Gestión de actividades) 
    * chat.service.ts (Funcionalidad de chat) 
    * report.service.ts (Generación de reportes) 

* Servicios específicos por rol: student.service.ts, teacher.service.ts, boss.service.ts, wellness.service.ts.

* interceptor.service.ts: Sugiere el manejo centralizado de peticiones HTTP,
  para adjuntar tokens de autenticación o manejar errores.

#### Desgloce

Los servicios de lógica de negocio se ubican en `src/app/services/`

* risk.service.ts: Es el corazón del sistema, maneja toda la lógica de obtención,
creación y actualización de los diferentes tipos de riesgos (académico,
económico, individual, institucional). Se encuentra ubicado en `src/app/services/risk.service.ts` y
contiene los siguientes métodos

| Método                   | Entrada (Solicita)                                                                                | Salida (Retorna)                                                                                      | Propósito Funcional Detallado                                                                                                      |
|--------------------------|---------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------|
| calculateTotalStatistics | statistics: StatisticsRisk (Objeto con criterios de filtro: risk, program, period, global, etc.). | Promise<StatisticsResponse> (Un objeto que contiene un array de Statistics con totales o contadores). | Calcula y obtiene métricas agregadas. Utilizado para llenar gráficos, dashboards, o secciones de resumen.                          |
| getStudentsInRisk        | statistics: StatisticsRisk (Mismo objeto de criterios que el anterior).                           | Promise<StudentsInRiskResponse> (Un objeto que contiene un array de User en riesgo).                  | Obtiene la lista detallada de usuarios. Utilizado para mostrar tablas de estudiantes o para operaciones de seguimiento individual. |

Pese a que ambos métodos utilizan el mismo endpoint (/risk/calulateStatistics)
y la lógica de procesamiento de criterios es similar, se utiliza un campo de
riesgo (en este caso aparenta ser `global?:`) para que el frontend retorne de
forma correcta tanto una lista cómo un resumen de estadísticas dependiendo del
caso.

De cualquier forma, el frontend se asegura de que no exista ambigüedad entre
las posibles respuestas de este endpoint a través de dos interfaces:
`StatisticsResponse` `StudentsInRiskRespones`. Se utiliza un efecto de NgRx
para actualizar el estado de la aplicación, en vez de implementarse aquí, para
facilitar la mantenibilidad.

* activity.service.ts: Gestiona las actividades relacionadas con el bienestar
  estudiantil. Específicamente, realiza operaciones básicas CRUD para la
  gestión de asistencia y la generación de reportes. Se localiza en
  `src/app/services/activity.service.ts`

| Método                | Tipo de Solicitud | Endpoint Base                | Entrada (Solicita)                                     | Salida (Retorna)          | Propósito Funcional                                                                                |
|-----------------------|-------------------|------------------------------|--------------------------------------------------------|---------------------------|----------------------------------------------------------------------------------------------------|
| createActivities      | POST              | /activity/                   | activity: Activity (Detalles de la nueva actividad).   | Promise<ResponseActivity> | Crea una nueva actividad de intervención o bienestar.                                              |
| listActivities        | GET               | /activity/                   | Ninguna                                                | Promise<Activity[]>       | Obtiene la lista completa de actividades (vista administrativa).                                   |
| listActivitiesStudent | GET               | /activity/activities-student | Ninguna                                                | Promise<Activity[]>       | Lista actividades relevantes o disponibles para el estudiante logueado.                            |
| listActivitiesAsist   | GET               | /activity/asist/:code        | code: String (Código del estudiante).                  | Promise<Activity[]>       | Lista actividades a las que un estudiante específico ha asistido.                                  |
| asistActivity         | POST              | /activity/asist              | asist: Boolean, activity: String (ID de la actividad). | Promise<any>              | Registra (true) o cancela (false) la asistencia de un usuario a una actividad.                     |
| desactiveActivity     | GET               | /activity/desactive/:id      | id: String (ID de la actividad).                       | Promise<any>              | Cambia el estado de una actividad a inactiva o cerrada (soft delete).                              |
| updateActivity        | PUT               | /activity/                   | id: String, activity: Activity (Nuevos datos).         | Promise<any>              | Actualiza los detalles de una actividad existente.                                                 |
| downloadReport        | GET               | /activity/download/:id       | id: String (ID de la actividad).                       | Promise<User[]>           | Genera un reporte de la actividad, devolviendo la lista de Usuarios que participaron o asistieron. |

La funcionalidad principal de este servicio está ligada a los campos risk y
riskLevel de la interfaz Activity. además El método `downloadReport` provee la
capacidad de descargar la asistencia como una lista de objetos User permite a
los administradores o personal de bienestar saber exactamente quién participó.
Se resalta que esta clase particular utiliza .toPromise() en todos sus métodos,
indicando una preferencia por el manejo asíncrono basado en Promise o
async/await en los componentes, en lugar de manejar directamente los
Observables de RxJS.

* auth.service.ts:  Uno de los servicios más críticos de la aplicación. Se
  encarga del inicio de sesión, la gestión del estado de autenticación (vía
  NgRx) la autorización de los roles y el manejo de horario del personal que lo
  requiere. Se ubica en `src/app/services/auth.service.ts`

| Método                  | Entrada (Solicita)                      | Salida (Retorna)                                                                    | Propósito y Retorno API                                                                                                           |
|-------------------------|-----------------------------------------|-------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------|
| login                   | dataLogin: UserAuth, typeUser: string   | void (Asíncrono, maneja el resultado con NgRx y navegación).                        | Inicia sesión con credenciales y redirige según el rol.                                                                           |
| loginWithGoogle         | role: String                            | void (Asíncrono, maneja el resultado con NgRx y navegación).                        | Inicia sesión mediante Google OAuth, verificando el dominio institucional (@ufps.edu.co).                                         |
| logout                  | role: String                            | void (Limpia todo el estado de NgRx, localStorage y redirige a la página de login). | Cierra la sesión del usuario.                                                                                                     |
| renewToken              | Ninguna                                 | Promise<AuthResponse>                                                               | Obtiene un nuevo token de autorización para mantener la sesión viva.                                                              |
| validateUserAuth        | role: string (Opcional, por defecto '') | Promise<boolean>                                                                    | Verifica la validez del token actual en el backend, opcionalmente validando si el token pertenece a un rol específico.            |
| sendEmailUpdatePassword | email: string                           | Promise<boolean>                                                                    | Inicia el proceso de recuperación de contraseña enviando un correo al usuario.                                                    |
| updatePassword          | password: string                        | Promise<boolean>                                                                    | Finaliza la recuperación de contraseña, estableciendo una nueva clave.                                                            |
| changePassword          | password: string                        | Promise<boolean>                                                                    | Permite al usuario autenticado cambiar su contraseña.                                                                             |
| createRole              | role: RoleSchedule                      | Promise<RoleResponse>                                                               | Crea un nuevo rol o asocia una configuración de horario a un rol.                                                                 |
| listRoles               | Ninguna                                 | Promise<Role[]>                                                                     | Obtiene la lista de roles disponibles en el sistema (no requiere token de autenticación).                                         |
| updateSchedule          | schedule: any                           | Promise<any>                                                                        | Modifica el horario de trabajo asociado a un rol (e.g., Bienestar o Psicólogo).                                                   |
| getSchedule             | role: string                            | Promise<any>                                                                        | Obtiene el horario de trabajo de un rol específico.                                                                               |
| getScheduleOfRole       | role: String, date: String              | Promise<ScheduleResponse>                                                           | Obtiene el horario de un rol para una fecha específica, incluyendo los espacios de tiempo que ya están reservados (reservations). |
| uploadPhoto             | formData: FormData                      | Promise<any>                                                                        | Sube la foto de perfil del usuario al backend.                                                                                    |


La implementación actual de loginWithGoogle verifica específicamente si el correo
termina en `@ufps.edu.co`, lo que confirma que la aplicación está diseñada para
operar dentro del ecosistema institucional, garantizando que solo el
personal o estudiantes validados accedan. Más sin embargo la implementación del
método aún es parcial, puesto que utilzia unos casos fijos de la API

El servicio logout hace uso de NgRx para garantizar la integridad del Frontend,
disparando múltiples acciones para deshacerse de estados residuales como `Chat,
Course, Notification, Risk`

* report.service.ts: este servicio se utiliza para la generación de reportes,
  principalmente del progreso de los estudiantes en proceso de recuperación, y
  del uso que se esté dando a los recursos proveídos para mejorar su desempeño. Se ubica en
  `src/app/services/report.service.ts`


| Método               | Tipo de Solicitud | Endpoint Base           | Entrada (Solicita)                                                              | Salida (Retorna) | Propósito Funcional                                                                                                             |
|----------------------|-------------------|-------------------------|---------------------------------------------------------------------------------|------------------|---------------------------------------------------------------------------------------------------------------------------------|
| reportSuggestion     | POST              | /report/suggestion      | data: any (Objeto con los parámetros de la sugerencia o criterios de filtrado). | Promise<any>     | Solicita la generación de un nuevo reporte. Los usuarios administrativos lo usarían para definir los datos que desean analizar. |
| lastReportSuggestion | GET               | /report/suggestion/last | Ninguna                                                                         | Promise<any>     | Recupera el último reporte o sugerencia de análisis generada.                                                                   |

La terminología "Suggestion" (Sugerencia) implica que los reportes no son solo
documentos estáticos, son analizados dinámicamente en el backend según el
contexto, y en este caso solicitados por el usuario directamente. Se utiliza el
endpoint `/report/suggestion` y además se cuenta con una versión para cachear
la última solicitud de reporte enviada en `/report/suggestion/last`. Implícitamente
se asume que hay más de un tipo de reporte emitible que debe respetar este endpoint.

* notification.service: esta clase gestiona diferentes niveles de notificaciones a lo largo de la aplicación de manera centralizada, valiéndose de
NgRx. Los métodos ṕrincipales en este servicio se desglozan de la siguiente manera.

| Método del Servicio            | Petición HTTP | Endpoint                           | Descripción                                             |
|--------------------------------|---------------|------------------------------------|---------------------------------------------------------|
| sendNotification(notification) | POST          | this.url + '/notification/'        | Envía una nueva notificación.                           |
| getNotifications(code)         | GET           | this.url + '/notification/' + code | Obtiene una lista de notificaciones por código.         |
| updateNotification(id)         | PUT           | this.url + '/notification/' + id   | Marca la notificación como leída o actualiza su estado. |
| deleteNotification(id)         | DELETE        | this.url + '/notification/' + id   | Elimina una notificación por su ID.                     |

Otro método destacable presente aquí es `getUserInformed(code: String, role: String, url: String):`
Qye realiza una petición GET a una ruta dinámica (ej. /students/123). Utiliza la función helper saveInLocalStorage para almacenar
el objeto de usuario (data) en el localStorage con claves 'receiver' y
'user-show', y luego redirige al usuario usando router.navigate([url]). Esto
sirve para preparar los datos para su uso en una vista posterior.

* student.service.ts: Este servicio actúa como la capa inyectable de comunicación con la API expuesta por el
backend relacionadas con el estudiantes, y sus dependencias directas (materias, historial) o sujetos relacionados (profesores).

| Área Funcional     | Métodos Principales                      | Tipo de Petición | Descripción                                                                                                                  |
|--------------------|------------------------------------------|------------------|------------------------------------------------------------------------------------------------------------------------------|
| Cursos             | listCourses, getCourses, getCoursesAc012 | GET              | Obtención de cursos matriculados y cursos asociados al riesgo AC012.                                                          |
| Postulación        | generatePostulation, validatePostulation | POST             | Funciones para crear y validar una postulación a las herramientas de apoyo.                                     |
| Ganancias/Riesgo   | getProfits, getProfitsAdmin, getRisk     | GET              | Obtención de datos financieros o de riesgo. getProfitsAdmin utiliza HttpParams para pasar los parámetros en la query string. |
| Estudiante/Profesor| getByCode, getTeacherOfCourse            | GET              | Obtención de datos del perfil del estudiante y del profesor asociado a un curso.                                             |
| Historial          | getSemesters, getRecord, saveRecord      | GET, POST        | Obtención de historial académico (semestres) y registros institucionales.                                                    |


Algunas posibles mejoras que podría recibir este servicio:

* El servicio maneja una amplia gama de
responsabilidades (cursos, notificaciones, postulaciones, riesgos, historial,
profesores). Esto podría violar el Principio de Responsabilidad Única (SRP). En
aplicaciones grandes, sería mejor dividir esta lógica en servicios más pequeños
(ej. CourseService, RiskService).

* Al igual que el NotificationService, este servicio utiliza intensivamente
.toPromise(). Esta práctica está obsoleta en Angular moderno. Se recomienda
usar Observables o firstValueFrom/lastValueFrom.

* Todos los bloques catch usan console.error(error) y devuelven null. Esto hace
que el manejo de errores en el componente que consume el servicio sea más
difícil, ya que null no proporciona información sobre el error HTTP.

* La propiedad url está tipada como String (clase JS wrapper) en lugar del tipo
primitivo string de TypeScript.

* En getRisk, hay una línea code = '0000000'; que sobrescribe el parámetro de
entrada. Esto es un riesgo potencial o una solución temporal que debería ser
revisada, ya que ignora el código real del estudiante.


### Infraestructura y Despliegue

Archivos que definen cómo se construye y se ejecuta la aplicación.

*  La presencia de Dockerfile y Dockerfile.prod indica que la aplicación está
   configurada para ser empaquetada y desplegada en contenedores utilizando
   Docker como motor (en este caso se contemplan dos escenarios, desarrollo y
   producción).

* Servidor Web: el frontend de Angular se sirve utilizando el servidor web
  Nginx en el entorno de producción (típico en despliegues con Docker) y se
      configura mediante nginx.conf.

* Los archivos environment.ts y environment.prod.ts permiten configurar
  variables de entorno específicas para distintos escenarios en los que se
  ejecuta la aplicación (e.g., URLs de la API, claves de configuración).
  Comúnmente utilizada para encapsular secretos de manera segura o configurar
  algunas herramientas ancillares del entorno de ejecución.

## Resumen de Cambios

Los componentes de la funcionalidad de chat no fueron implementados correctamente y no son funcionales, por lo que se consideró
sensato eliminar menciones de estos en los servicios de la aplicación.

~~~
# En el archivo src/app/components/components.module.ts

# En el archivo /src/app/dashboard-student/children/children-routing.module.ts

# En el archivo src/app/app.module.ts
ChatAdminComponent

# En el archivo src/app/app.reducers.ts
chat:fromChat.ChatState;

# En el archivo src/app/services/auth.service.ts
DeleteChatAction

# en el archivo data.ts
Método toChat()

# en el archivo routes.ts
componente app-modal-chat
~~~