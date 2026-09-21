'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  FileText,
  FolderKanban,
  MessageSquareText,
  Moon,
  Paperclip,
  Plus,
  RotateCcw,
  Search,
  Send,
  ShieldCheck,
  Sparkles,
  Sun,
  Trash2,
  UploadCloud,
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

type Screen = 'home' | 'wizard' | 'chat' | 'result' | 'project' | 'trash';
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
type DeletedBudget = {
  budget: Budget;
  deletedAt: number;
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
    status: 'Confirmado',
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
function Shell({
  screen,
  go,
  trashCount,
  dark,
  toggleTheme,
  children,
}: {
  screen: Screen;
  go: (s: Screen) => void;
  trashCount: number;
  dark: boolean;
  toggleTheme: () => void;
  children: React.ReactNode;
}) {
  return (
    <main className={`pc-app ${dark ? 'pc-dark' : ''}`}>
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
          <button
            className={screen === 'trash' ? 'active' : ''}
            onClick={() => go('trash')}
          >
            <Trash2 />
            Papelera
            {trashCount > 0 && <b>{trashCount}</b>}
          </button>
        </nav>
        <div className="pc-user-menu">
          <button
            className="pc-theme-toggle"
            onClick={toggleTheme}
            aria-label={dark ? 'Activar modo claro' : 'Activar modo oscuro'}
            title={dark ? 'Activar modo claro' : 'Activar modo oscuro'}
          >
            {dark ? <Sun /> : <Moon />}
          </button>
          <div className="pc-session-user">
            <span>LM</span>
            <p>
              <b>Lucía Martínez</b>
              <small>Presupuestadora</small>
            </p>
          </div>
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
          className={screen === 'trash' ? 'active' : ''}
          onClick={() => go('trash')}
        >
          <Trash2 />
          <span>Papelera</span>
        </button>
      </nav>
    </main>
  );
}
function Home({
  budgets,
  open,
  create,
  remove,
}: {
  budgets: Budget[];
  open: (b: Budget) => void;
  create: () => void;
  remove: (b: Budget) => void;
}) {
  const [q, setQ] = useState('');
  const [filter, setFilter] = useState<'all' | 'drafts' | 'recent'>('all');
  const rows = budgets.filter(
    (b) =>
      (b.client.toLowerCase().includes(q.toLowerCase()) ||
        b.modules.join(' ').toLowerCase().includes(q.toLowerCase())) &&
      (filter === 'all' ||
        (filter === 'drafts' &&
          ['Borrador', 'En relevamiento'].includes(b.status)) ||
        (filter === 'recent' && b.status !== 'Borrador')),
  );
  return (
    <div className="pc-page pc-home">
      <section className="pc-welcome">
        <div>
          <small>PRESUPUESTACIÓN INTERNA</small>
          <h1>Buen día, Lucía</h1>
          <p>Creá una estimación o retomá una conversación reciente.</p>
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
      <section className="pc-home-filters" aria-label="Filtrar presupuestos">
        <button
          className={filter === 'all' ? 'active' : ''}
          onClick={() => setFilter('all')}
        >
          Todos <b>{budgets.length}</b>
        </button>
        <button
          className={filter === 'drafts' ? 'active' : ''}
          onClick={() => setFilter('drafts')}
        >
          Borradores{' '}
          <b>
            {
              budgets.filter((b) =>
                ['Borrador', 'En relevamiento'].includes(b.status),
              ).length
            }
          </b>
        </button>
        <button
          className={filter === 'recent' ? 'active' : ''}
          onClick={() => setFilter('recent')}
        >
          Recientes{' '}
          <b>{budgets.filter((b) => b.status !== 'Borrador').length}</b>
        </button>
      </section>
      <section className="pc-list-card">
        <header>
          <div>
            <h2>Chats de presupuesto</h2>
            <p>Cada conversación conserva su contexto y sus respuestas.</p>
          </div>
          <div className="pc-search-box">
            <Search />
            <Input
              aria-label="Buscar cliente o módulo"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Buscar cliente o módulo"
            />
          </div>
        </header>
        <div className="pc-budget-list">
          {rows.map((b) => (
            <article key={b.id}>
              <button className="pc-budget-open" onClick={() => open(b)}>
                <span className="pc-avatar">
                  {b.client
                    .split(' ')
                    .map((x) => x[0])
                    .join('')
                    .slice(0, 2)}
                </span>
                <span className="pc-budget-name">
                  <b>Presupuesto · {b.client}</b>
                  <small>
                    PR-{b.id} · {b.service} ·{' '}
                    {b.modules.join(', ') || 'Alcance por definir'}
                  </small>
                </span>
                <span className="pc-status">{b.status}</span>
                <span className="pc-budget-hours">
                  <b>{b.estimate ? `${b.estimate} SPU` : 'Pendiente'}</b>
                  <small>Estimación</small>
                </span>
                <span
                  className={`pc-budget-destination ${
                    b.estimate ? 'dashboard' : 'conversation'
                  }`}
                >
                  {b.estimate ? <BarChart3 /> : <MessageSquareText />}
                  {b.estimate ? 'Ver dashboard' : 'Continuar chat'}
                  <ChevronRight />
                </span>
              </button>
              <button
                className="pc-budget-delete"
                aria-label={`Enviar Presupuesto ${b.client} a la papelera`}
                onClick={() => remove(b)}
              >
                <Trash2 />
              </button>
            </article>
          ))}
          {rows.length === 0 && (
            <div className="pc-list-empty">
              <Search />
              <b>No encontramos presupuestos</b>
              <span>Probá con otro término o elegí otro filtro.</span>
            </div>
          )}
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
  const valid1 = !!draft.client.trim();
  const valid2 =
    draft.modules.length > 0 &&
    (!draft.modules.includes('Compras') || draft.purchaseVariants.length > 0);
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
              <label className="wide" htmlFor="budget-client">
                Cliente o proyecto
                <Input
                  id="budget-client"
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
              <div className="pc-field-label">Módulos o procesos</div>
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
            {draft.modules.includes('Compras') && (
              <div className="pc-form-block highlighted">
                <div className="pc-field-label">
                  ¿Qué variantes de Compras incluye?
                </div>
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
              <label htmlFor="budget-users">
                Usuarios previstos
                <Input
                  id="budget-users"
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
              <label htmlFor="budget-companies">
                Empresas o razones sociales
                <Input
                  id="budget-companies"
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
                  {draft.service} · {draft.product} · {draft.industry}
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
                  {draft.complexity} · {draft.background}
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
      text: `Ya tengo el contexto inicial de ${budget.client}: ${budget.service}, ${budget.industry} y ${budget.modules.join(', ')}. Voy a completar contigo los datos que todavía faltan y que pueden cambiar la estimación.`,
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
  const messageIdRef = useRef(1000);
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
    const baseId = messageIdRef.current;
    messageIdRef.current += 2;
    const add: ChatMessage[] = [{ id: baseId, role: 'user', text: v.trim() }];
    if (next < questions.length)
      add.push({
        id: baseId + 1,
        role: 'preco',
        text: questions[next].text,
      });
    else
      add.push({
        id: baseId + 1,
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
            ['Negocio', budget.industry],
            ['Módulos', budget.modules.join(', ')],
            [
              'Escala',
              `${budget.users || 'Por definir'} usuarios · ${budget.companies || 'Por definir'} empresas`,
            ],
            ['Complejidad', budget.complexity],
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
  if (b.modules.includes('Compras'))
    technical += Math.max(0, b.purchaseVariants.length - 1) * 6;
  technical *= b.users > 200 ? 1.24 : b.users > 50 ? 1.1 : 1;
  technical += Math.max(0, b.companies - 1) * 4;
  technical *=
    b.complexity === 'Alta' ? 1.25 : b.complexity === 'Media' ? 1.12 : 1;
  technical = Math.round(technical);
  const management = Math.round(technical * 0.18),
    uat = Math.round(technical * 0.2),
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
    ['Gestión', c.management, '18% sobre el esfuerzo técnico'],
    ['UAT', c.uat, '20% para validación de usuario'],
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
          <small>SPU ESTIMADOS</small>
          <strong>
            {c.total}
            <span> SPU</span>
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
                  <strong>{h as number} SPU</strong>
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
                [budget.service, 'Tipo de servicio'],
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
              ['Caso histórico 1042', 'STAR · Compras', '+9%'],
              ['Caso histórico 2318', 'STAR · Compras', '+13%'],
              ['Caso histórico 5077', 'ODC · Tesorería', '+4%'],
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
  const [openStage, setOpenStage] = useState('02');
  const hours = budget.estimate || calculate(budget).total;
  const stages = [
    {
      id: '01',
      name: 'Gestión del proyecto',
      spu: 12,
      items: [
        ['Kickoff y planificación', 3],
        ['Seguimiento y coordinación', 6],
        ['Cierre y documentación', 3],
      ],
    },
    {
      id: '02',
      name: 'Diseño de procesos',
      spu: 24,
      items: [
        ['Relevamiento funcional', 8],
        ['Diseño del proceso objetivo', 10],
        ['Validación con referentes', 6],
      ],
    },
    {
      id: '03',
      name: 'Configuración y setup',
      spu: 32,
      items: [
        ['Parametrización base', 14],
        ['Datos maestros e inicialización', 10],
        ['Validación de configuración', 8],
      ],
    },
    {
      id: '04',
      name: 'Desarrollos',
      spu: 16,
      items: [
        ['Diseño técnico', 4],
        ['Construcción o adaptación', 8],
        ['Pruebas técnicas', 4],
      ],
    },
    {
      id: '05',
      name: 'Capacitación',
      spu: 8,
      items: [
        ['Preparación de materiales', 2],
        ['Capacitación a usuarios clave', 4],
        ['Acompañamiento inicial', 2],
      ],
    },
    {
      id: '06',
      name: 'UAT',
      spu: 10,
      items: [
        ['Preparación de escenarios', 3],
        ['Ejecución y soporte de pruebas', 5],
        ['Correcciones y conformidad', 2],
      ],
    },
    {
      id: '07',
      name: 'PEM y estabilización',
      spu: 6,
      items: [
        ['Puesta en marcha', 2],
        ['Monitoreo inicial', 2],
        ['Estabilización y cierre', 2],
      ],
    },
  ];
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
          ['plan', 'Desglose'],
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
              <strong>{hours} SPU</strong>
              <p>Versión confirmada</p>
            </article>
            <article>
              <small>EJECUTADO</small>
              <strong>
                {budget.status === 'En ejecución' ? '46 SPU' : '0 SPU'}
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
              <Button className="pc-continue-preco" onClick={talk}>
                <Sparkles />
                <span>Continuar con PRECO</span>
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
              Los SPU se organizan en las siete etapas definidas por Finnegans.
            </p>
          </header>
          <div className="pc-stage-list">
            {stages.map((stage, i) => {
              const expanded = openStage === stage.id;
              return (
                <article key={stage.id} className={expanded ? 'expanded' : ''}>
                  <button
                    className="pc-stage-summary"
                    onClick={() => setOpenStage(expanded ? '' : stage.id)}
                    aria-expanded={expanded}
                  >
                    <span className="pc-stage-number">{stage.id}</span>
                    <span className="pc-stage-title">
                      <b>{stage.name}</b>
                      <small>{stage.items.length} componentes</small>
                    </span>
                    <span className="pc-stage-track">
                      <i
                        style={{
                          width:
                            i < 2 && budget.status === 'En ejecución'
                              ? '75%'
                              : '0%',
                        }}
                      />
                    </span>
                    <strong>{stage.spu} SPU</strong>
                    <ChevronDown className="pc-stage-chevron" />
                  </button>
                  {expanded && (
                    <div className="pc-stage-detail">
                      <p>
                        <span>Componente</span>
                        <span>Esfuerzo</span>
                      </p>
                      {stage.items.map(([name, spu]) => (
                        <p key={name}>
                          <span>
                            <CheckCircle2 />
                            {name}
                          </span>
                          <b>{spu} SPU</b>
                        </p>
                      ))}
                    </div>
                  )}
                </article>
              );
            })}
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
              ['Negocio', budget.industry],
              ['Producto', budget.product],
              ['Módulos', budget.modules.join(', ')],
              ['Licencias', String(budget.users)],
              ['Sociedades', String(budget.companies)],
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
function Trash({
  deleted,
  restore,
  back,
}: {
  deleted: DeletedBudget[];
  restore: (item: DeletedBudget) => void;
  back: () => void;
}) {
  const [selected, setSelected] = useState<DeletedBudget | null>(null);
  const [now] = useState(() => Date.now());
  const daysLeft = (deletedAt: number) => {
    const elapsed = Math.floor((now - deletedAt) / 86_400_000);
    return Math.max(1, 7 - elapsed);
  };
  return (
    <div className="pc-page pc-trash-page">
      <button className="pc-back" onClick={back}>
        <ArrowLeft />
        Volver a presupuestos
      </button>
      <header className="pc-trash-heading">
        <div>
          <small>PAPELERA</small>
          <h1>Presupuestos eliminados</h1>
          <p>
            Podés restaurarlos durante siete días antes de su eliminación
            definitiva.
          </p>
        </div>
      </header>
      {deleted.length > 0 ? (
        <section className="pc-trash-list">
          {deleted.map((item) => (
            <article key={item.budget.id}>
              <span className="pc-avatar">
                {item.budget.client
                  .split(' ')
                  .map((x) => x[0])
                  .join('')
                  .slice(0, 2)}
              </span>
              <span>
                <b>Presupuesto · {item.budget.client}</b>
                <small>
                  PR-{item.budget.id} · Se elimina en {daysLeft(item.deletedAt)}{' '}
                  días
                </small>
              </span>
              <Button variant="outline" onClick={() => setSelected(item)}>
                <RotateCcw />
                Restaurar
              </Button>
            </article>
          ))}
        </section>
      ) : (
        <section className="pc-trash-empty">
          <span>
            <Trash2 />
          </span>
          <h2>La papelera está vacía</h2>
          <p>
            Los chats de presupuesto que elimines aparecerán acá durante siete
            días.
          </p>
          <Button variant="outline" onClick={back}>
            Volver a presupuestos
          </Button>
        </section>
      )}
      <Dialog
        open={!!selected}
        onOpenChange={(open) => !open && setSelected(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Restaurar presupuesto</DialogTitle>
            <DialogDescription>
              “Presupuesto · {selected?.budget.client}” volverá a aparecer junto
              a tus conversaciones activas.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelected(null)}>
              Cancelar
            </Button>
            <Button
              onClick={() => {
                if (selected) restore(selected);
                setSelected(null);
              }}
            >
              <RotateCcw />
              Restaurar presupuesto
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
export default function FunctionalPrecoApp() {
  const [screen, setScreen] = useState<Screen>('home');
  const [dark, setDark] = useState(false);
  const [budgets, setBudgets] = useState(initial);
  const [deleted, setDeleted] = useState<DeletedBudget[]>([]);
  const [draft, setDraft] = useState<Budget>(blank());
  const [active, setActive] = useState<Budget>(initial[0]);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteCandidate, setDeleteCandidate] = useState<Budget | null>(null);
  useEffect(() => {
    setDark(window.localStorage.getItem('preco-theme') === 'dark');
  }, []);
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
  const remove = (budget: Budget) => {
    setBudgets((all) => all.filter((item) => item.id !== budget.id));
    setDeleted((all) => [{ budget, deletedAt: Date.now() }, ...all]);
    setDeleteCandidate(null);
  };
  const restore = (item: DeletedBudget) => {
    setDeleted((all) => all.filter((x) => x.budget.id !== item.budget.id));
    setBudgets((all) => [item.budget, ...all]);
  };
  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    window.localStorage.setItem('preco-theme', next ? 'dark' : 'light');
  };
  return (
    <Shell
      screen={screen}
      go={go}
      trashCount={deleted.length}
      dark={dark}
      toggleTheme={toggleTheme}
    >
      {screen === 'home' && (
        <Home
          budgets={budgets}
          open={open}
          create={() => go('wizard')}
          remove={setDeleteCandidate}
        />
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
          back={() => setScreen(active.estimate ? 'project' : 'home')}
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
      {screen === 'trash' && (
        <Trash
          deleted={deleted}
          restore={restore}
          back={() => setScreen('home')}
        />
      )}
      <Dialog
        open={!!deleteCandidate}
        onOpenChange={(open) => !open && setDeleteCandidate(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enviar presupuesto a la papelera</DialogTitle>
            <DialogDescription>
              “Presupuesto · {deleteCandidate?.client}” dejará de aparecer en la
              lista principal. Podrás restaurarlo durante siete días.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteCandidate(null)}>
              Cancelar
            </Button>
            <Button
              className="pc-danger-button"
              onClick={() => deleteCandidate && remove(deleteCandidate)}
            >
              <Trash2 />
              Enviar a papelera
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
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
