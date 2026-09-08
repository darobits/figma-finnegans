'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  Check,
  CheckCircle2,
  ChevronRight,
  FileText,
  FolderKanban,
  LogOut,
  MessageSquareText,
  Paperclip,
  Plus,
  Search,
  Send,
  ShieldCheck,
  Sparkles,
  UploadCloud,
  UserRound,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import './functional.css';

type Screen = 'home' | 'wizard' | 'chat' | 'result' | 'project' | 'profile';
type Service = 'STAR' | 'ODC' | 'IMAS';
type Budget = {
  id: number;
  client: string;
  service: Service;
  product: string;
  model: 'FULL' | 'Small';
  industry: string;
  owner: string;
  modules: string[];
  purchaseVariants: string[];
  users: number;
  companies: number;
  volume: number;
  infrastructure: string;
  environments: string[];
  complexity: string;
  background: string;
  document?: string;
  status: string;
  estimate?: number;
  answers: string[];
};
type ChatMessage = {
  id: number;
  role: 'user' | 'preco';
  text: string;
  tone?: 'warning' | 'summary';
};
const modules = [
  'Compras',
  'Tesorería',
  'Ventas',
  'Contabilidad',
  'Manufactura',
  'Impuestos',
];
const purchaseOptions = [
  'Compras de insumos',
  'Compras de servicios',
  'Compras de bienes de uso',
  'Compras del exterior',
  'Compras en consignación',
  'Bot de compras',
  'Impresos de compras',
];
const initial: Budget[] = [
  {
    id: 247,
    client: 'Agro Andina',
    service: 'STAR',
    product: 'DAI',
    model: 'FULL',
    industry: 'Agropecuario',
    owner: 'Lucía Martínez',
    modules: ['Compras', 'Tesorería', 'Contabilidad'],
    purchaseVariants: ['Compras de insumos', 'Compras del exterior'],
    users: 230,
    companies: 4,
    volume: 1800,
    infrastructure: 'Amazon',
    environments: ['DESA', 'QA', 'PROD'],
    complexity: 'Alta',
    background: 'Experiencia estándar',
    document: 'RFP Agro Andina.docx',
    status: 'En relevamiento',
    answers: [],
  },
  {
    id: 246,
    client: 'Logística del Sur',
    service: 'ODC',
    product: 'One Team',
    model: 'Small',
    industry: 'Logística',
    owner: 'Martín Ríos',
    modules: ['Tesorería'],
    purchaseVariants: [],
    users: 84,
    companies: 2,
    volume: 620,
    infrastructure: 'Amazon',
    environments: ['QA', 'PROD'],
    complexity: 'Media',
    background: 'Experiencia estándar',
    document: 'Alcance Tesorería.xlsx',
    status: 'En ejecución',
    estimate: 128,
    answers: [],
  },
  {
    id: 245,
    client: 'Grupo Horizonte',
    service: 'IMAS',
    product: 'DAI',
    model: 'Small',
    industry: 'Servicios',
    owner: 'Sofía Acosta',
    modules: ['Ventas'],
    purchaseVariants: [],
    users: 46,
    companies: 1,
    volume: 650,
    infrastructure: 'Servidor propio',
    environments: ['QA', 'PROD'],
    complexity: 'Estándar',
    background: 'Sin antecedentes',
    status: 'Estimado',
    estimate: 68,
    answers: [],
  },
];
const blank = (): Budget => ({
  id: Math.floor(1000 + Math.random() * 8000),
  client: '',
  service: 'STAR',
  product: 'DAI',
  model: 'FULL',
  industry: 'Agropecuario',
  owner: 'Lucía Martínez',
  modules: [],
  purchaseVariants: [],
  users: 0,
  companies: 0,
  volume: 0,
  infrastructure: 'Amazon',
  environments: [],
  complexity: 'Estándar',
  background: 'Sin antecedentes',
  status: 'Borrador',
  answers: [],
});
function Brand({ dark = false }: { dark?: boolean }) {
  return (
    <div className={`pc-brand ${dark ? 'dark' : ''}`}>
      <svg viewBox="0 0 44 56">
        <ellipse cx="24" cy="10" rx="20" ry="7" />
        <ellipse cx="18" cy="29" rx="15" ry="7" />
        <circle cx="10" cy="47" r="7" />
      </svg>
      <b>Finnegans</b>
      <i />
      <strong>PRECO</strong>
    </div>
  );
}
function Login({ enter }: { enter: () => void }) {
  const [email, setEmail] = useState('lucia.martinez@finnegans.com');
  const [pass, setPass] = useState('preco2026');
  return (
    <main className="pc-login">
      <section className="pc-login-story">
        <Brand dark />
        <div>
          <span className="pc-ai-mark">
            <Sparkles />
          </span>
          <h1>Presupuesto Companion</h1>
          <p>Tu asistente para estimar horas de implementación.</p>
        </div>
        <small>Uso interno de Finnegans</small>
      </section>
      <section className="pc-login-form">
        <div>
          <div className="pc-login-logo">
            <Brand />
          </div>
          <h2>Iniciar sesión</h2>
          <p>Bienvenido a PRECO.</p>
          <label>
            Correo corporativo
            <Input value={email} onChange={(e) => setEmail(e.target.value)} />
          </label>
          <label>
            Contraseña
            <Input
              type="password"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
            />
          </label>
          <Button onClick={enter} disabled={!email.trim() || !pass.trim()}>
            Ingresar a PRECO
            <ArrowRight />
          </Button>
          <span>
            <ShieldCheck />
            Acceso de demostración
          </span>
        </div>
      </section>
    </main>
  );
}
function Shell({
  screen,
  go,
  logout,
  children,
}: {
  screen: Screen;
  go: (s: Screen) => void;
  logout: () => void;
  children: React.ReactNode;
}) {
  return (
    <main className="pc-app">
      <header className="pc-header">
        <button className="pc-logo-button" onClick={() => go('home')}>
          <Brand />
        </button>
        <nav>
          <button
            className={
              screen === 'home' || screen === 'project' ? 'active' : ''
            }
            onClick={() => go('home')}
          >
            <FolderKanban />
            Presupuestos
          </button>
          <button
            className={
              ['wizard', 'chat', 'result'].includes(screen) ? 'active' : ''
            }
            onClick={() => go('wizard')}
          >
            <Plus />
            Nuevo presupuesto
          </button>
        </nav>
        <div className="pc-user-menu">
          <button onClick={() => go('profile')}>
            <span>LM</span>
            <b>Lucía Martínez</b>
          </button>
          <button aria-label="Cerrar sesión" onClick={logout}>
            <LogOut />
          </button>
        </div>
      </header>
      <div className="pc-content">{children}</div>
      <nav className="pc-mobile-nav">
        <button
          className={screen === 'home' || screen === 'project' ? 'active' : ''}
          onClick={() => go('home')}
        >
          <FolderKanban />
          <span>Presupuestos</span>
        </button>
        <button
          className={
            ['wizard', 'chat', 'result'].includes(screen) ? 'active' : ''
          }
          onClick={() => go('wizard')}
        >
          <Plus />
          <span>Nuevo</span>
        </button>
        <button
          className={screen === 'profile' ? 'active' : ''}
          onClick={() => go('profile')}
        >
          <UserRound />
          <span>Perfil</span>
        </button>
      </nav>
    </main>
  );
}
function Home({
  budgets,
  open,
  create,
}: {
  budgets: Budget[];
  open: (b: Budget) => void;
  create: () => void;
}) {
  const [q, setQ] = useState('');
  const rows = budgets.filter(
    (b) =>
      b.client.toLowerCase().includes(q.toLowerCase()) ||
      b.modules.join(' ').toLowerCase().includes(q.toLowerCase()),
  );
  return (
    <div className="pc-page pc-home">
      <section className="pc-welcome">
        <div>
          <small>PRESUPUESTACIÓN INTERNA</small>
          <h1>Buen día, Lucía</h1>
          <p>Tenés presupuestos que necesitan una acción.</p>
        </div>
        <Button onClick={create}>
          <Plus />
          Crear presupuesto
        </Button>
      </section>
      <section className="pc-next-action">
        <span>
          <Sparkles />
        </span>
        <div>
          <small>CONTINUAR DONDE QUEDASTE</small>
          <h2>Agro Andina necesita definiciones</h2>
          <p>
            PRECO espera información sobre integraciones y desarrollos
            personalizados.
          </p>
        </div>
        <Button variant="outline" onClick={() => open(budgets[0])}>
          Continuar
          <ArrowRight />
        </Button>
      </section>
      <section className="pc-pipeline">
        {['Borrador', 'En relevamiento', 'Estimado', 'En ejecución'].map(
          (label) => (
            <article key={label}>
              <strong>
                {budgets.filter((b) => b.status === label).length}
              </strong>
              <span>{label}</span>
            </article>
          ),
        )}
      </section>
      <section className="pc-list-card">
        <header>
          <div>
            <h2>Mis presupuestos</h2>
            <p>Abrí un proyecto para ver la acción que corresponde.</p>
          </div>
          <label>
            <Search />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Buscar cliente o módulo"
            />
          </label>
        </header>
        <div className="pc-budget-list">
          {rows.map((b) => (
            <button key={b.id} onClick={() => open(b)}>
              <span className="pc-avatar">
                {b.client
                  .split(' ')
                  .map((x) => x[0])
                  .join('')
                  .slice(0, 2)}
              </span>
              <span className="pc-budget-name">
                <b>{b.client}</b>
                <small>
                  PR-{b.id} · {b.service} · {b.modules.join(', ')}
                </small>
              </span>
              <span className="pc-status">{b.status}</span>
              <span className="pc-budget-hours">
                <b>{b.estimate ? `${b.estimate} h` : 'Pendiente'}</b>
                <small>Estimación</small>
              </span>
              <ChevronRight />
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
function Choice({
  selected,
  children,
  onClick,
}: {
  selected: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className={`pc-choice ${selected ? 'selected' : ''}`}
      onClick={onClick}
    >
      {selected && <Check />}
      {children}
    </button>
  );
}
function Wizard({
  draft,
  setDraft,
  start,
  cancel,
}: {
  draft: Budget;
  setDraft: (b: Budget) => void;
  start: () => void;
  cancel: () => void;
}) {
  const [step, setStep] = useState(1);
  const valid1 = !!draft.client.trim() && !!draft.owner.trim();
  const valid2 =
    draft.modules.length > 0 &&
    (draft.model === 'Small' ||
      !draft.modules.includes('Compras') ||
      draft.purchaseVariants.length > 0);
  const toggle = (
    key: 'modules' | 'purchaseVariants' | 'environments',
    value: string,
  ) =>
    setDraft({
      ...draft,
      [key]: draft[key].includes(value)
        ? draft[key].filter((x) => x !== value)
        : [...draft[key], value],
    });
  return (
    <div className="pc-page pc-wizard">
      <button className="pc-back" onClick={cancel}>
        <ArrowLeft />
        Volver a presupuestos
      </button>
      <header className="pc-wizard-title">
        <div>
          <small>NUEVO PRESUPUESTO</small>
          <h1>Contanos qué necesitás estimar</h1>
          <p>
            PRECO usará estos datos para hacer preguntas específicas. Podrás
            corregirlos después.
          </p>
        </div>
        <span>Paso {step} de 3</span>
      </header>
      <div className="pc-stepper">
        {[
          ['1', 'Identificación'],
          ['2', 'Alcance y escala'],
          ['3', 'Revisión'],
        ].map(([n, label], i) => (
          <div className={step > i ? 'active' : ''} key={n}>
            <span>{step > i + 1 ? <Check /> : n}</span>
            <b>{label}</b>
          </div>
        ))}
      </div>
      <section className="pc-wizard-card">
        {step === 1 && (
          <>
            <div className="pc-section-heading">
              <span>1</span>
              <div>
                <h2>Identificación del presupuesto</h2>
                <p>
                  Quién es el cliente y qué tipo de trabajo vamos a evaluar.
                </p>
              </div>
            </div>
            <div className="pc-form-grid">
              <label className="wide">
                Cliente o proyecto
                <Input
                  value={draft.client}
                  onChange={(e) =>
                    setDraft({ ...draft, client: e.target.value })
                  }
                  placeholder="Ej. Nativa Alimentos"
                />
              </label>
              <label>
                Tipo de servicio
                <select
                  value={draft.service}
                  onChange={(e) =>
                    setDraft({ ...draft, service: e.target.value as Service })
                  }
                >
                  <option>STAR</option>
                  <option>ODC</option>
                  <option>IMAS</option>
                </select>
                <small>
                  STAR es una implementación amplia, ODC un alcance puntual e
                  IMAS un servicio continuo.
                </small>
              </label>
              <label>
                Equipo o producto
                <select
                  value={draft.product}
                  onChange={(e) =>
                    setDraft({ ...draft, product: e.target.value })
                  }
                >
                  <option>DAI</option>
                  <option>One Team</option>
                </select>
              </label>
              <label>
                Modelo de alcance
                <select
                  value={draft.model}
                  onChange={(e) =>
                    setDraft({
                      ...draft,
                      model: e.target.value as 'FULL' | 'Small',
                      purchaseVariants: [],
                    })
                  }
                >
                  <option>FULL</option>
                  <option>Small</option>
                </select>
                <small>
                  FULL detalla variantes; Small usa módulos agrupados.
                </small>
              </label>
              <label>
                Tipo de negocio
                <select
                  value={draft.industry}
                  onChange={(e) =>
                    setDraft({ ...draft, industry: e.target.value })
                  }
                >
                  <option>Agropecuario</option>
                  <option>Construcción</option>
                  <option>Servicios</option>
                  <option>Industria</option>
                  <option>Logística</option>
                  <option>Salud</option>
                </select>
              </label>
              <label className="wide">
                Responsable
                <Input
                  value={draft.owner}
                  onChange={(e) =>
                    setDraft({ ...draft, owner: e.target.value })
                  }
                />
              </label>
            </div>
          </>
        )}
        {step === 2 && (
          <>
            <div className="pc-section-heading">
              <span>2</span>
              <div>
                <h2>Alcance y escala</h2>
                <p>
                  Elegí los módulos y completá los datos que más modifican el
                  esfuerzo.
                </p>
              </div>
            </div>
            <div className="pc-form-block">
              <label>Módulos o procesos</label>
              <div className="pc-choice-grid">
                {modules.map((x) => (
                  <Choice
                    key={x}
                    selected={draft.modules.includes(x)}
                    onClick={() => toggle('modules', x)}
                  >
                    {x}
                  </Choice>
                ))}
              </div>
            </div>
            {draft.model === 'FULL' && draft.modules.includes('Compras') && (
              <div className="pc-form-block highlighted">
                <label>¿Qué variantes de Compras incluye?</label>
                <p>
                  Esta separación evita comparar proyectos con alcances
                  diferentes.
                </p>
                <div className="pc-choice-grid variants">
                  {purchaseOptions.map((x) => (
                    <Choice
                      key={x}
                      selected={draft.purchaseVariants.includes(x)}
                      onClick={() => toggle('purchaseVariants', x)}
                    >
                      {x}
                    </Choice>
                  ))}
                </div>
              </div>
            )}
            <div className="pc-form-grid compact">
              <label>
                Usuarios previstos
                <Input
                  type="number"
                  min="0"
                  value={draft.users}
                  onChange={(e) =>
                    setDraft({ ...draft, users: Number(e.target.value) })
                  }
                />
                <small>
                  Personas que usarán Finnegans. Ingresá 0 si todavía no lo
                  sabés.
                </small>
              </label>
              <label>
                Empresas o razones sociales
                <Input
                  type="number"
                  min="0"
                  value={draft.companies}
                  onChange={(e) =>
                    setDraft({ ...draft, companies: Number(e.target.value) })
                  }
                />
                <small>
                  Empresas que trabajarán en el sistema. Ingresá 0 si está por
                  definir.
                </small>
              </label>
              <label>
                Volumen mensual aproximado
                <Input
                  type="number"
                  min="0"
                  value={draft.volume}
                  onChange={(e) =>
                    setDraft({ ...draft, volume: Number(e.target.value) })
                  }
                />
                <small>
                  Ejemplo: órdenes, facturas o pagos por mes. Puede quedar en 0
                  si no se conoce.
                </small>
              </label>
              <label>
                Infraestructura
                <select
                  value={draft.infrastructure}
                  onChange={(e) =>
                    setDraft({ ...draft, infrastructure: e.target.value })
                  }
                >
                  <option>Amazon</option>
                  <option>Servidor propio</option>
                  <option>Híbrida</option>
                </select>
              </label>
              <label>
                Complejidad inicial
                <select
                  value={draft.complexity}
                  onChange={(e) =>
                    setDraft({ ...draft, complexity: e.target.value })
                  }
                >
                  <option>Estándar</option>
                  <option>Media</option>
                  <option>Alta</option>
                </select>
              </label>
              <label>
                Antecedentes
                <select
                  value={draft.background}
                  onChange={(e) =>
                    setDraft({ ...draft, background: e.target.value })
                  }
                >
                  <option>Sin antecedentes</option>
                  <option>Experiencia estándar</option>
                  <option>Antecedentes complejos</option>
                </select>
              </label>
            </div>
            <div className="pc-form-block">
              <label>Ambientes necesarios</label>
              <p>
                Elegí dónde se preparará, probará y utilizará el sistema. Si no
                lo sabés, dejalos sin seleccionar y PRECO lo preguntará.
              </p>
              <div className="pc-choice-grid environments">
                {[
                  ['DESA', 'Preparación y configuración'],
                  ['QA', 'Pruebas antes de publicar'],
                  ['PROD', 'Sistema de uso real'],
                ].map(([x, detail]) => (
                  <Choice
                    key={x}
                    selected={draft.environments.includes(x)}
                    onClick={() => toggle('environments', x)}
                  >
                    <span className="pc-environment-option">
                      <b>{x}</b>
                      <small>{detail}</small>
                    </span>
                  </Choice>
                ))}
              </div>
            </div>
          </>
        )}
        {step === 3 && (
          <>
            <div className="pc-section-heading">
              <span>3</span>
              <div>
                <h2>Revisá antes de conversar</h2>
                <p>PRECO tomará esta ficha como punto de partida.</p>
              </div>
            </div>
            <div className="pc-review-grid">
              <article>
                <small>CLIENTE Y SERVICIO</small>
                <b>{draft.client}</b>
                <p>
                  {draft.service} · {draft.product} · {draft.model}
                </p>
                <button onClick={() => setStep(1)}>Editar</button>
              </article>
              <article>
                <small>ALCANCE</small>
                <b>{draft.modules.join(', ')}</b>
                <p>
                  {draft.purchaseVariants.length
                    ? `${draft.purchaseVariants.length} variantes de Compras`
                    : 'Sin variantes adicionales'}
                </p>
                <button onClick={() => setStep(2)}>Editar</button>
              </article>
              <article>
                <small>ESCALA</small>
                <b>
                  {draft.users
                    ? `${draft.users} usuarios previstos`
                    : 'Usuarios por definir'}{' '}
                  ·{' '}
                  {draft.companies
                    ? `${draft.companies} empresas`
                    : 'Empresas por definir'}
                </b>
                <p>
                  {draft.environments.length
                    ? draft.environments.join(' · ')
                    : 'Ambientes por definir'}{' '}
                  ·{' '}
                  {draft.volume
                    ? `${draft.volume.toLocaleString('es-AR')} operaciones mensuales`
                    : 'Volumen por definir'}
                </p>
                <button onClick={() => setStep(2)}>Editar</button>
              </article>
            </div>
            <div className="pc-upload">
              <UploadCloud />
              <div>
                <b>{draft.document || 'Adjuntar documentación'}</b>
                <p>
                  RFP, alcance, minuta, Word, PDF o Excel. Es opcional para la
                  demo.
                </p>
              </div>
              <label>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.xls,.xlsx"
                  onChange={(e) =>
                    e.target.files?.[0] &&
                    setDraft({ ...draft, document: e.target.files[0].name })
                  }
                />
                {draft.document ? 'Cambiar archivo' : 'Seleccionar archivo'}
              </label>
            </div>
            <div className="pc-ready-note">
              <Sparkles />
              <div>
                <b>PRECO preparará preguntas preventivas</b>
                <p>No calculará hasta resolver los faltantes importantes.</p>
              </div>
            </div>
          </>
        )}
        <footer>
          <Button
            variant="outline"
            onClick={() => (step === 1 ? cancel() : setStep(step - 1))}
          >
            {step === 1 ? 'Cancelar' : 'Anterior'}
          </Button>
          {step < 3 ? (
            <Button
              disabled={step === 1 ? !valid1 : !valid2}
              onClick={() => setStep(step + 1)}
            >
              Continuar
              <ArrowRight />
            </Button>
          ) : (
            <Button onClick={start}>
              <Sparkles />
              Crear y conversar con PRECO
            </Button>
          )}
        </footer>
      </section>
    </div>
  );
}
function buildQuestions(b: Budget) {
  const q: { text: string; options: string[] }[] = [];
  if (!b.users)
    q.push({
      text: '¿Aproximadamente cuántas personas utilizarán Finnegans?',
      options: ['Hasta 25', 'Entre 26 y 100', 'Entre 101 y 250', 'Más de 250'],
    });
  if (!b.companies)
    q.push({
      text: '¿Cuántas empresas o razones sociales trabajarán dentro del sistema?',
      options: [
        'Una empresa',
        '2 o 3 empresas',
        '4 o más',
        'Todavía no se sabe',
      ],
    });
  if (!b.volume)
    q.push({
      text: '¿Qué volumen mensual aproximado tendrá el proceso principal?',
      options: [
        'Hasta 500 operaciones',
        'Entre 501 y 2.000',
        'Más de 2.000',
        'No se conoce',
      ],
    });
  if (!b.environments.length)
    q.push({
      text: '¿En qué ambientes deberá prepararse y utilizarse la solución?',
      options: ['QA y PROD', 'DESA, QA y PROD', 'Solo PROD', 'A definir'],
    });
  if (b.purchaseVariants.includes('Compras del exterior'))
    q.push({
      text: 'Veo que el alcance incluye Compras del exterior. ¿Cómo se resolverá la interacción con organismos, despachantes o sistemas externos?',
      options: [
        'Sin integración',
        'Integración con AFIP',
        'Interfaz con despachante',
        'A definir',
      ],
    });
  if (b.users > 200)
    q.push({
      text: `Hay ${b.users} usuarios previstos. ¿Cómo se distribuirán las personas clave para capacitación y validación?`,
      options: [
        'Un equipo central',
        'Por sociedad',
        'Por sede o región',
        'Todavía no está definido',
      ],
    });
  if (b.companies > 1)
    q.push({
      text: `El proyecto contempla ${b.companies} empresas. ¿Compartirán procesos y reglas o tendrán diferencias relevantes?`,
      options: [
        'Proceso común',
        'Diferencias menores',
        'Reglas por sociedad',
        'A relevar',
      ],
    });
  if (b.complexity !== 'Estándar')
    q.push({
      text: 'Marcaste una complejidad mayor a la estándar. ¿Qué tipo de particularización esperás?',
      options: [
        'Sólo configuración',
        'Implementación no code',
        'Diseño de software',
        'Desarrollo personalizado',
      ],
    });
  q.push({
    text: 'Para cerrar el relevamiento, ¿hay alguna dependencia o restricción que pueda afectar el trabajo?',
    options: [
      'No hay dependencias',
      'Disponibilidad del cliente',
      'Datos de origen',
      'Otro sistema o proveedor',
    ],
  });
  return q;
}
function Chat({
  budget,
  update,
  calculate,
  back,
}: {
  budget: Budget;
  update: (b: Budget) => void;
  calculate: () => void;
  back: () => void;
}) {
  const questions = useMemo(() => buildQuestions(budget), [budget]);
  const [index, setIndex] = useState(
    Math.min(budget.answers.length, questions.length),
  );
  const [input, setInput] = useState('');
  const seed: ChatMessage[] = [
    {
      id: 1,
      role: 'preco',
      tone: 'summary',
      text: `Ya tengo el contexto inicial de ${budget.client}: ${budget.service}, modelo ${budget.model} y ${budget.modules.join(', ')}. Voy a completar contigo los datos que todavía faltan y que pueden cambiar la estimación.`,
    },
  ];
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const m = [...seed];
    budget.answers.forEach((a, i) =>
      m.push(
        { id: 10 + i * 2, role: 'preco', text: questions[i]?.text || '' },
        { id: 11 + i * 2, role: 'user', text: a },
      ),
    );
    if (budget.answers.length < questions.length)
      m.push({
        id: 100,
        role: 'preco',
        text: questions[budget.answers.length].text,
      });
    return m;
  });
  const complete = index >= questions.length;
  const messagesRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const container = messagesRef.current;
    if (container) container.scrollTop = container.scrollHeight;
  }, [messages]);
  const risk =
    budget.users > 200 ||
    budget.companies > 3 ||
    budget.complexity === 'Alta' ||
    budget.modules.length > 3;
  const answer = (v: string) => {
    if (!v.trim() || complete) return;
    const answers = [...budget.answers, v.trim()];
    const next = index + 1;
    const add: ChatMessage[] = [
      { id: Date.now(), role: 'user', text: v.trim() },
    ];
    if (next < questions.length)
      add.push({
        id: Date.now() + 1,
        role: 'preco',
        text: questions[next].text,
      });
    else
      add.push({
        id: Date.now() + 1,
        role: 'preco',
        tone: risk ? 'warning' : 'summary',
        text: risk
          ? 'Las características detectadas podrían corresponder a un proyecto de mayor envergadura. La estimación incluirá una advertencia por escala o complejidad y mostrará los factores aplicados.'
          : 'El relevamiento preventivo está completo. Ya puedo preparar una estimación explicada y auditable.',
      });
    setMessages((m) => [...m, ...add]);
    setIndex(next);
    setInput('');
    update({
      ...budget,
      answers,
      status:
        next >= questions.length ? 'Listo para estimar' : 'En relevamiento',
    });
  };
  const progress = Math.round(
    (Math.min(index, questions.length) / questions.length) * 100,
  );
  return (
    <div className="pc-chat-page">
      <header className="pc-chat-header">
        <button onClick={back}>
          <ArrowLeft />
        </button>
        <div>
          <b>{budget.client}</b>
          <small>
            {budget.service} · {budget.modules.join(', ')}
          </small>
        </div>
        <span>
          {complete ? 'Relevamiento completo' : `${progress}% completo`}
        </span>
      </header>
      <div className="pc-chat-layout">
        <aside className="pc-chat-brief">
          <small>FICHA INICIAL</small>
          <h2>Lo que PRECO ya sabe</h2>
          {[
            ['Servicio', budget.service],
            ['Modelo', budget.model],
            ['Módulos', budget.modules.join(', ')],
            [
              'Escala',
              `${budget.users || 'Por definir'} usuarios · ${budget.companies || 'Por definir'} empresas`,
            ],
            [
              'Infraestructura',
              `${budget.infrastructure} · ${budget.environments.join(' / ')}`,
            ],
          ].map(([a, b]) => (
            <p key={a}>
              <span>{a}</span>
              <b>{b}</b>
            </p>
          ))}
          <button onClick={back}>Corregir datos</button>
        </aside>
        <main className="pc-conversation">
          <div className="pc-chat-intro">
            <span>
              <Sparkles />
            </span>
            <div>
              <b>PRECO</b>
              <p>
                {complete
                  ? 'Listo para estimar'
                  : `Pregunta ${index + 1} de ${questions.length} · Precisemos tu presupuesto`}
              </p>
            </div>
          </div>
          <div className="pc-messages" ref={messagesRef}>
            <div
              role="log"
              aria-label="Conversación con PRECO"
              aria-live="polite"
            >
              {messages.map((m) => (
                <article
                  className={`pc-message pc-message--${m.role} ${m.tone ? `pc-message--${m.tone}` : ''}`}
                  key={m.id}
                >
                  {m.role === 'preco' && (
                    <span>
                      <Sparkles />
                    </span>
                  )}
                  <div>
                    <small>{m.role === 'preco' ? 'PRECO' : 'VOS'}</small>
                    <p>{m.text}</p>
                  </div>
                </article>
              ))}
            </div>
            {!complete && (
              <div className="pc-chat-options">
                {questions[index].options.map((x) => (
                  <button key={x} onClick={() => answer(x)}>
                    {x}
                    <ChevronRight />
                  </button>
                ))}
              </div>
            )}
            {complete && (
              <section className="pc-chat-ready">
                <CheckCircle2 />
                <div>
                  <small>LISTO PARA CALCULAR</small>
                  <h3>Ya no quedan bloqueos críticos</h3>
                  <p>
                    Podés revisar la estimación y volver al chat si querés
                    cambiar una respuesta.
                  </p>
                </div>
                <Button onClick={calculate}>
                  Preparar estimación
                  <ArrowRight />
                </Button>
              </section>
            )}
          </div>
          <footer>
            <Paperclip />
            <Textarea
              value={input}
              aria-label="Tu respuesta para PRECO"
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (
                  e.key === 'Enter' &&
                  !e.shiftKey &&
                  !e.nativeEvent.isComposing
                ) {
                  e.preventDefault();
                  answer(input);
                }
              }}
              disabled={complete}
              placeholder={
                complete
                  ? 'Relevamiento completo'
                  : 'Escribí otra respuesta o agregá contexto'
              }
            />
            <button
              disabled={!input.trim() || complete}
              aria-label="Enviar respuesta"
              onClick={() => answer(input)}
            >
              <Send />
            </button>
          </footer>
        </main>
      </div>
    </div>
  );
}
function calculate(b: Budget) {
  const bases: Record<string, number> = {
    Compras: 40,
    Tesorería: 34,
    Ventas: 36,
    Contabilidad: 32,
    Manufactura: 46,
    Impuestos: 38,
  };
  let technical = b.modules.reduce((s, m) => s + (bases[m] || 30), 0);
  if (b.model === 'FULL' && b.modules.includes('Compras'))
    technical += Math.max(0, b.purchaseVariants.length - 1) * 6;
  technical *= b.users > 200 ? 1.24 : b.users > 50 ? 1.1 : 1;
  technical +=
    Math.max(0, b.companies - 1) * 4 +
    Math.max(0, b.environments.length - 1) * 3;
  technical *=
    b.complexity === 'Alta' ? 1.25 : b.complexity === 'Media' ? 1.12 : 1;
  technical = Math.round(technical);
  const management = Math.round(technical * 0.12),
    uat = Math.round(technical * 0.1),
    reserve = b.answers.some((x) =>
      /desarrollo|a definir|proveedor|reglas por sociedad/i.test(x),
    )
      ? Math.round(technical * 0.08)
      : 0;
  return {
    technical,
    management,
    uat,
    reserve,
    total: technical + management + uat + reserve,
  };
}
function Result({
  budget,
  confirm,
  back,
}: {
  budget: Budget;
  confirm: (h: number) => void;
  back: () => void;
}) {
  const c = calculate(budget);
  const rows = [
    ['Trabajo técnico', c.technical, 'Ítems, escala, empresas y complejidad'],
    ['Gestión', c.management, '12% sobre el esfuerzo técnico'],
    ['UAT', c.uat, '10% para validación de usuario'],
    [
      'Reserva preventiva',
      c.reserve,
      c.reserve
        ? 'Dependencias o particularizaciones detectadas'
        : 'No aplicada',
    ],
  ];
  return (
    <div className="pc-page pc-result">
      <button className="pc-back" onClick={back}>
        <ArrowLeft />
        Volver al chat
      </button>
      <header className="pc-result-heading">
        <div>
          <small>ESTIMACIÓN PRELIMINAR</small>
          <h1>{budget.client}</h1>
          <p>Resultado generado con reglas demostrativas versionadas.</p>
        </div>
        <Badge>preco.v1</Badge>
      </header>
      <section className="pc-result-total">
        <div>
          <small>HORAS PRESUPUESTADAS</small>
          <strong>
            {c.total}
            <span> h</span>
          </strong>
          <p>Esfuerzo técnico más gestión, UAT y reserva aplicable</p>
        </div>
        <aside>
          <Button variant="outline" onClick={back}>
            <MessageSquareText />
            Preguntar o modificar
          </Button>
          <Button onClick={() => confirm(c.total)}>
            <Check />
            Confirmar presupuesto
          </Button>
        </aside>
      </section>
      <div className="pc-result-layout">
        <main>
          <section className="pc-card">
            <header>
              <h2>De dónde sale el total</h2>
              <p>
                Las partes del cálculo están separadas para que puedan
                revisarse.
              </p>
            </header>
            <div className="pc-breakdown">
              {rows.map(([l, h, d]) => (
                <article key={l as string}>
                  <span>
                    <b>{l as string}</b>
                    <small>{d as string}</small>
                  </span>
                  <strong>{h as number} h</strong>
                </article>
              ))}
            </div>
          </section>
          <section className="pc-card">
            <header>
              <h2>Factores que movieron la estimación</h2>
            </header>
            <div className="pc-factors">
              {[
                [`${budget.modules.length} módulos`, 'Alcance'],
                [`${budget.users || 'Por definir'} usuarios`, 'Escala'],
                [
                  `${budget.companies || 'Por definir'} empresas`,
                  'Multiempresa',
                ],
                [budget.complexity, 'Complejidad'],
                [`${budget.environments.length} ambientes`, 'Infraestructura'],
              ].map(([v, l]) => (
                <p key={l}>
                  <span>{l}</span>
                  <b>{v}</b>
                </p>
              ))}
            </div>
          </section>
        </main>
        <aside>
          <section className="pc-card pc-confidence">
            <small>CALIDAD DE LA EVIDENCIA</small>
            <h2>{budget.document ? 'Media alta' : 'Media'}</h2>
            <div>
              <i style={{ width: budget.document ? '82%' : '68%' }} />
            </div>
            <p>
              {budget.document
                ? 'Formulario, conversación y documentación disponible.'
                : 'Formulario y conversación completos. Falta documentación adjunta.'}
            </p>
          </section>
          <section className="pc-card pc-history">
            <header>
              <h2>Comparables elegibles</h2>
              <p>Casos del snapshot que pasaron controles de calidad.</p>
            </header>
            {[
              ['Caso histórico 1042', 'STAR · FULL', '+9%'],
              ['Caso histórico 2318', 'STAR · FULL', '+13%'],
              ['Caso histórico 5077', 'ODC · Small', '+4%'],
            ].map((x) => (
              <p key={x[0]}>
                <span>
                  <b>{x[0]}</b>
                  <small>{x[1]}</small>
                </span>
                <em>{x[2]}</em>
              </p>
            ))}
          </section>
          <section className="pc-audit">
            <ShieldCheck />
            <span>
              <b>Estimación auditable</b>
              <small>
                Fórmula preco.v1 · Snapshot 2025–2026 · escenario 01
              </small>
            </span>
          </section>
        </aside>
      </div>
    </div>
  );
}
function Project({
  budget,
  talk,
  goHome,
}: {
  budget: Budget;
  talk: () => void;
  goHome: () => void;
}) {
  const [tab, setTab] = useState<'summary' | 'plan' | 'scope' | 'evidence'>(
    'summary',
  );
  const hours = budget.estimate || calculate(budget).total;
  return (
    <div className="pc-page pc-project">
      <button className="pc-back" onClick={goHome}>
        <ArrowLeft />
        Mis presupuestos
      </button>
      <header className="pc-project-heading">
        <div>
          <small>PR-{budget.id}</small>
          <h1>{budget.client}</h1>
          <p>
            {budget.service} · {budget.product} · {budget.modules.join(', ')}
          </p>
        </div>
        <span className="pc-status">{budget.status}</span>
      </header>
      <nav className="pc-tabs">
        {[
          ['summary', 'Resumen'],
          ['plan', 'Plan y horas'],
          ['scope', 'Alcance'],
          ['evidence', 'Evidencia'],
        ].map(([id, label]) => (
          <button
            className={tab === id ? 'active' : ''}
            key={id}
            onClick={() => setTab(id as typeof tab)}
          >
            {label}
          </button>
        ))}
      </nav>
      {tab === 'summary' && (
        <>
          <section className="pc-project-kpis">
            <article>
              <small>PRESUPUESTO</small>
              <strong>{hours} h</strong>
              <p>Versión confirmada</p>
            </article>
            <article>
              <small>EJECUTADO</small>
              <strong>
                {budget.status === 'En ejecución' ? '46 h' : '0 h'}
              </strong>
              <p>Horas registradas</p>
            </article>
            <article>
              <small>ESTADO</small>
              <strong>{budget.status}</strong>
              <p>Próximo paso visible debajo</p>
            </article>
          </section>
          <section className="pc-project-next">
            <span>
              <Sparkles />
            </span>
            <div>
              <small>PRÓXIMA ACCIÓN</small>
              <h2>
                {budget.estimate
                  ? 'Revisar el plan de ejecución'
                  : 'Completar el relevamiento preventivo'}
              </h2>
              <p>
                {budget.estimate
                  ? 'La estimación ya tiene una línea base. Podés consultar etapas y alcance.'
                  : 'PRECO necesita cerrar algunas definiciones antes de calcular.'}
              </p>
            </div>
            {!budget.estimate && (
              <Button onClick={talk}>
                Continuar con PRECO
                <ArrowRight />
              </Button>
            )}
          </section>
        </>
      )}
      {tab === 'plan' && (
        <section className="pc-card">
          <header>
            <h2>Plan estándar de implementación</h2>
            <p>
              Las horas se organizan en las siete etapas definidas por
              Finnegans.
            </p>
          </header>
          <div className="pc-stage-list">
            {[
              ['01', 'Gestión del proyecto', 12],
              ['02', 'Diseño de procesos', 24],
              ['03', 'Configuración y setup', 32],
              ['04', 'Desarrollos', 16],
              ['05', 'Capacitación', 8],
              ['06', 'UAT', 10],
              ['07', 'PEM y estabilización', 6],
            ].map(([n, name, h], i) => (
              <article key={n as string}>
                <span>{n as string}</span>
                <b>{name as string}</b>
                <div>
                  <i
                    style={{
                      width:
                        i < 2 && budget.status === 'En ejecución'
                          ? '75%'
                          : '0%',
                    }}
                  />
                </div>
                <strong>{h as number} h</strong>
              </article>
            ))}
          </div>
        </section>
      )}
      {tab === 'scope' && (
        <section className="pc-card">
          <header>
            <h2>Alcance confirmado</h2>
            <p>Información usada por PRECO para elegir preguntas y reglas.</p>
          </header>
          <div className="pc-scope-grid">
            {[
              ['Servicio', budget.service],
              ['Modelo', budget.model],
              ['Producto', budget.product],
              ['Módulos', budget.modules.join(', ')],
              ['Licencias', String(budget.users)],
              ['Sociedades', String(budget.companies)],
              ['Ambientes', budget.environments.join(' · ')],
              ['Complejidad', budget.complexity],
            ].map(([l, v]) => (
              <article key={l}>
                <small>{l}</small>
                <b>{v}</b>
              </article>
            ))}
          </div>
          {budget.purchaseVariants.length > 0 && (
            <div className="pc-included">
              <h3>Variantes de Compras incluidas</h3>
              {budget.purchaseVariants.map((x) => (
                <span key={x}>
                  <Check />
                  {x}
                </span>
              ))}
            </div>
          )}
        </section>
      )}
      {tab === 'evidence' && (
        <section className="pc-card">
          <header>
            <h2>Evidencia y trazabilidad</h2>
            <p>Fuentes utilizadas y versión del cálculo.</p>
          </header>
          <div className="pc-evidence-list">
            <p>
              <FileText />
              <span>
                <b>{budget.document || 'Sin documento adjunto'}</b>
                <small>
                  {budget.document
                    ? 'Procesado para la demostración'
                    : 'La evidencia se basa en formulario y conversación'}
                </small>
              </span>
            </p>
            <p>
              <BarChart3 />
              <span>
                <b>Snapshot histórico 2025–2026</b>
                <small>Casos elegibles después de normalización</small>
              </span>
            </p>
            <p>
              <ShieldCheck />
              <span>
                <b>Fórmula preco.v1</b>
                <small>Reglas demostrativas y escenario versionado</small>
              </span>
            </p>
          </div>
        </section>
      )}
    </div>
  );
}
function Profile() {
  const [saved, setSaved] = useState(false);
  return (
    <div className="pc-page pc-profile">
      <header>
        <small>CUENTA</small>
        <h1>Mi perfil</h1>
        <p>Información visible dentro del equipo de presupuestación.</p>
      </header>
      {saved && (
        <div className="pc-success">
          <Check />
          Perfil actualizado
        </div>
      )}
      <section className="pc-card">
        <div className="pc-profile-head">
          <span>LM</span>
          <div>
            <h2>Lucía Martínez</h2>
            <p>Líder de implementación</p>
          </div>
        </div>
        <div className="pc-form-grid">
          <label>
            Nombre
            <Input defaultValue="Lucía Martínez" />
          </label>
          <label>
            Correo
            <Input defaultValue="lucia.martinez@finnegans.com" />
          </label>
          <label>
            Área
            <Input defaultValue="Implementaciones" />
          </label>
          <label>
            Rol
            <Input value="Líder y presupuestadora" disabled />
          </label>
        </div>
        <footer>
          <Button onClick={() => setSaved(true)}>Guardar cambios</Button>
        </footer>
      </section>
    </div>
  );
}
export default function FunctionalPrecoApp() {
  const [logged, setLogged] = useState(false);
  const [screen, setScreen] = useState<Screen>('home');
  const [budgets, setBudgets] = useState(initial);
  const [draft, setDraft] = useState<Budget>(blank());
  const [active, setActive] = useState<Budget>(initial[0]);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const go = (s: Screen) => {
    if (s === 'wizard') setDraft(blank());
    setScreen(s);
  };
  const open = (b: Budget) => {
    setActive(b);
    setScreen(b.estimate ? 'project' : 'chat');
  };
  const start = () => {
    const b = { ...draft, status: 'En relevamiento' };
    setBudgets((all) => [b, ...all]);
    setActive(b);
    setScreen('chat');
  };
  const update = (b: Budget) => {
    setActive(b);
    setBudgets((all) => all.map((x) => (x.id === b.id ? b : x)));
  };
  const save = (h: number) => {
    const b = { ...active, estimate: h, status: 'Confirmado' };
    update(b);
    setConfirmOpen(false);
    setScreen('project');
  };
  if (!logged)
    return (
      <Login
        enter={() => {
          setLogged(true);
          setScreen('home');
        }}
      />
    );
  return (
    <Shell screen={screen} go={go} logout={() => setLogged(false)}>
      {screen === 'home' && (
        <Home budgets={budgets} open={open} create={() => go('wizard')} />
      )}{' '}
      {screen === 'wizard' && (
        <Wizard
          draft={draft}
          setDraft={setDraft}
          start={start}
          cancel={() => setScreen('home')}
        />
      )}{' '}
      {screen === 'chat' && (
        <Chat
          budget={active}
          update={update}
          calculate={() => setScreen('result')}
          back={() => setScreen('project')}
        />
      )}{' '}
      {screen === 'result' && (
        <Result
          budget={active}
          back={() => setScreen('chat')}
          confirm={() => setConfirmOpen(true)}
        />
      )}{' '}
      {screen === 'project' && (
        <Project
          budget={active}
          talk={() => setScreen('chat')}
          goHome={() => setScreen('home')}
        />
      )}{' '}
      {screen === 'profile' && <Profile />}
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar presupuesto</DialogTitle>
            <DialogDescription>
              Se guardará esta versión como línea base del proyecto. Después
              podrás registrar cambios sin perder el cálculo original.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmOpen(false)}>
              Volver
            </Button>
            <Button onClick={() => save(calculate(active).total)}>
              Confirmar y crear línea base
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Shell>
  );
}
