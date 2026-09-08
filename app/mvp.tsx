'use client';
import { useEffect, useRef, useState } from 'react';
import {
  AlertTriangle,
  ArchiveRestore,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  BriefcaseBusiness,
  Check,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  Clock3,
  FileText,
  FolderKanban,
  History,
  Info,
  Layers3,
  Mail,
  Menu,
  MessageSquareText,
  Paperclip,
  PanelLeftClose,
  PanelLeftOpen,
  Pencil,
  Plus,
  RotateCcw,
  Search,
  Send,
  Settings,
  ShieldCheck,
  Sparkles,
  Trash2,
  UserRound,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import './mvp.css';
import './responsive.css';
import './professional.css';
import ProjectView from './project-view';
import EstimationStart, { type EstimateInput } from './estimation-start';
import EstimationResult from './estimation-result';
type Screen =
  | 'budgets'
  | 'project'
  | 'chat'
  | 'result'
  | 'feedback'
  | 'trash'
  | 'settings';
type Budget = {
  id: number;
  client: string;
  service: string;
  product: string;
  process: string;
  status: string;
  estimate: string;
  owner: string;
  updated: string;
};
type Msg = {
  id: number;
  who: 'user' | 'preco';
  text: string;
  kind?: 'risk' | 'doc';
  time?: string;
};
const seed: Budget[] = [
  {
    id: 1,
    client: 'Agro Andina',
    service: 'STAR',
    product: 'DAI',
    process: 'Compras',
    status: 'En relevamiento',
    estimate: '—',
    owner: 'Lucía Martínez',
    updated: 'Hoy, 10:24',
  },
  {
    id: 2,
    client: 'Logística del Sur',
    service: 'ODC',
    product: 'OneTeam',
    process: 'Tesorería',
    status: 'En ejecución',
    estimate: '128 h',
    owner: 'Martín Ríos',
    updated: 'Ayer, 16:40',
  },
  {
    id: 3,
    client: 'Grupo Horizonte',
    service: 'IMAS',
    product: 'DAI',
    process: 'Ventas',
    status: 'Estimado',
    estimate: '64–72 h',
    owner: 'Sofía Acosta',
    updated: '29 ago',
  },
  {
    id: 4,
    client: 'Clínica Central',
    service: 'ODC',
    product: 'OneTeam',
    process: 'Contabilidad',
    status: 'Confirmado',
    estimate: '96 h',
    owner: 'Diego Costa',
    updated: '27 ago',
  },
  {
    id: 5,
    client: 'Nativa Alimentos',
    service: 'STAR',
    product: 'OneTeam',
    process: 'Compras',
    status: 'Borrador',
    estimate: '—',
    owner: 'Elena Funes',
    updated: 'Hoy, 09:12',
  },
  {
    id: 6,
    client: 'Cooperativa del Centro',
    service: 'ODC',
    product: 'DAI',
    process: 'Tesorería',
    status: 'Listo para estimar',
    estimate: '48–56 h',
    owner: 'Lucía Martínez',
    updated: '4 sep',
  },
  {
    id: 7,
    client: 'Servicios Patagónicos',
    service: 'IMAS',
    product: 'OneTeam',
    process: 'Ventas',
    status: 'En relevamiento',
    estimate: '—',
    owner: 'Martín Ríos',
    updated: '3 sep',
  },
  {
    id: 8,
    client: 'Laboratorios Río',
    service: 'STAR',
    product: 'DAI',
    process: 'Contabilidad',
    status: 'Confirmado',
    estimate: '74 h',
    owner: 'Sofía Acosta',
    updated: '1 sep',
  },
  {
    id: 9,
    client: 'Campo Norte',
    service: 'ODC',
    product: 'DAI',
    process: 'Compras',
    status: 'Finalizado',
    estimate: '112 h',
    owner: 'Diego Costa',
    updated: '28 ago',
  },
];
const cases = [
  ['Caso A', 'STAR', 'Compras', '60 h', '72 h'],
  ['Caso B', 'STAR', 'Compras', '68 h', '70 h'],
  ['Caso C', 'ODC', 'Compras', '55 h', '74 h'],
  ['Caso D', 'IMAS', 'Compras', '82 h', '88 h'],
];
function Brand() {
  return (
    <div className="pm-brand">
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
function Src({ children }: { children: string }) {
  return (
    <Badge className={`pm-src ${children.toLowerCase().replaceAll(' ', '-')}`}>
      {children}
    </Badge>
  );
}
function Stat({ children }: { children: string }) {
  return <Badge className="pm-stat">{children}</Badge>;
}
function Side({
  screen,
  go,
  open,
  close,
}: {
  screen: Screen;
  go: (s: Screen) => void;
  open: boolean;
  close: () => void;
}) {
  const nav = (s: Screen) => {
    go(s);
    close();
  };
  return (
    <aside className={`pm-side ${open ? 'open' : ''}`}>
      <header>
        <Brand />
        <button onClick={close}>
          <X />
        </button>
      </header>
      <nav>
        <small>TRABAJO</small>
        <button
          className={
            screen === 'budgets' || screen === 'project' ? 'active' : ''
          }
          onClick={() => nav('budgets')}
        >
          <FolderKanban />
          Mis presupuestos
        </button>
        <button
          className={screen === 'chat' ? 'active' : ''}
          onClick={() => nav('chat')}
        >
          <Sparkles />
          Nueva estimación <b>IA</b>
        </button>
        <small>SECUNDARIOS</small>
        <button
          className={screen === 'trash' ? 'active' : ''}
          onClick={() => nav('trash')}
        >
          <Trash2 />
          Papelera
        </button>
        <button
          className={screen === 'settings' ? 'active' : ''}
          onClick={() => nav('settings')}
        >
          <UserRound />
          Mi perfil
        </button>
      </nav>
      <footer>
        <div>
          <span>LM</span>
          <p>
            <b>Lucía Martínez</b>
            <small>Líder de implementación</small>
          </p>
        </div>
        <p>
          <ShieldCheck />
          Entorno interno Finnegans
        </p>
      </footer>
    </aside>
  );
}
function Top({ screen, menu }: { screen: Screen; menu: () => void }) {
  const label = {
    budgets: 'Mis presupuestos',
    project: 'Proyecto',
    chat: 'PRECO',
    result: 'Estimación técnica',
    feedback: 'Cierre del proyecto',
    trash: 'Papelera',
    settings: 'Mi perfil',
  }[screen];
  return (
    <header className="pm-top">
      <button onClick={menu}>
        <Menu />
      </button>
      <div>
        <small>PRECO /</small>
        <b>{label}</b>
      </div>
      <span>
        <CircleHelp />
        Ayuda
      </span>
    </header>
  );
}
function Head({
  over,
  title,
  sub,
  action,
}: {
  over: string;
  title: string;
  sub: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="pm-head">
      <div>
        <small>{over}</small>
        <h1>{title}</h1>
        <p>{sub}</p>
      </div>
      {action}
    </div>
  );
}
function Budgets({
  items,
  setItems,
  move,
  go,
  note,
  openProject,
}: {
  items: Budget[];
  setItems: (x: Budget[]) => void;
  move: (x: Budget) => void;
  go: (x: Screen) => void;
  note: string;
  openProject: (project: Budget) => void;
}) {
  const [q, setQ] = useState('');
  const [srv, setSrv] = useState('Todos');
  const [status, setStatus] = useState('Todos');
  const [edit, setEdit] = useState<Budget | null>(null);
  const [pendingDelete, setPendingDelete] = useState<Budget | null>(null);
  const [name, setName] = useState('');
  const rows = items.filter(
    (x) =>
      (x.client.toLowerCase().includes(q.toLowerCase()) ||
        x.process.toLowerCase().includes(q.toLowerCase())) &&
      (srv === 'Todos' || x.service === srv) &&
      (status === 'Todos' || x.status === status),
  );
  return (
    <div className="pm-page">
      <Head
        over="PRESUPUESTACIÓN"
        title="Mis presupuestos"
        sub="Organizá relevamientos, estimaciones y proyectos en curso."
        action={
          <Button onClick={() => go('chat')}>
            <Plus />
            Nueva estimación
          </Button>
        }
      />
      {note && (
        <div className="pm-note">
          <Check />
          {note}
        </div>
      )}
      <div className="pm-tools">
        <label>
          <Search />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar cliente o proceso…"
          />
        </label>
        <select value={srv} onChange={(e) => setSrv(e.target.value)}>
          <option>Todos</option>
          <option>STAR</option>
          <option>ODC</option>
          <option>IMAS</option>
        </select>
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option>Todos</option>
          {[
            'Borrador',
            'En relevamiento',
            'Listo para estimar',
            'Estimado',
            'Confirmado',
            'En ejecución',
            'Finalizado',
          ].map((x) => (
            <option key={x}>{x}</option>
          ))}
        </select>
        <button
          onClick={() => {
            setQ('');
            setSrv('Todos');
            setStatus('Todos');
          }}
        >
          <RotateCcw />
          Limpiar
        </button>
      </div>
      <section className="pm-table">
        <header>
          <b>{rows.length} presupuestos</b>
          <span>
            Datos ficticios para recorrer todas las acciones del prototipo
          </span>
        </header>
        <div>
          <table>
            <thead>
              <tr>
                {[
                  'CLIENTE / PROYECTO',
                  'SERVICIO',
                  'PRODUCTO / EQUIPO',
                  'MÓDULO O PROCESO',
                  'ESTADO',
                  'ESTIMACIÓN',
                  'RESPONSABLE',
                  'ACTUALIZADO',
                  'ACCIONES',
                ].map((x) => (
                  <th key={x}>{x}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((b, i) => (
                <tr key={b.id}>
                  <td>
                    <span className={`pm-client c${i % 4}`}>
                      {b.client
                        .split(' ')
                        .map((x) => x[0])
                        .join('')
                        .slice(0, 2)}
                    </span>
                    <button onClick={() => openProject(b)}>
                      <b>{b.client}</b>
                      <small>PR-{String(248 - b.id).padStart(4, '0')}</small>
                    </button>
                  </td>
                  <td>
                    <Badge>{b.service}</Badge>
                  </td>
                  <td>{b.product}</td>
                  <td>{b.process}</td>
                  <td>
                    <Stat>{b.status}</Stat>
                  </td>
                  <td>
                    <b>{b.estimate}</b>
                  </td>
                  <td>{b.owner}</td>
                  <td>{b.updated}</td>
                  <td>
                    <p className="pm-actions">
                      <button
                        className="pm-open-action"
                        aria-label={`Ver ${b.client}`}
                        title="Ver proyecto"
                        onClick={() => openProject(b)}
                      >
                        <ArrowRight />
                      </button>
                      <button
                        className="pm-edit-action"
                        aria-label={`Editar ${b.client}`}
                        title="Editar"
                        onClick={() => {
                          setEdit(b);
                          setName(b.client);
                        }}
                      >
                        <Pencil />
                      </button>
                      <button
                        aria-label={`Mover ${b.client} a la papelera`}
                        title="Mover a la papelera"
                        onClick={() => setPendingDelete(b)}
                      >
                        <Trash2 />
                      </button>
                    </p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!rows.length && (
          <aside className="pm-empty">
            <Search />
            <b>No encontramos presupuestos</b>
          </aside>
        )}
      </section>
      <Dialog open={!!edit} onOpenChange={(v) => !v && setEdit(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar presupuesto</DialogTitle>
            <DialogDescription>
              Actualizá el nombre del cliente o proyecto.
            </DialogDescription>
          </DialogHeader>
          <label className="pm-field">
            Cliente / proyecto
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </label>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEdit(null)}>
              Cancelar
            </Button>
            <Button
              onClick={() => {
                if (edit)
                  setItems(
                    items.map((x) =>
                      x.id === edit.id
                        ? { ...x, client: name, updated: 'Ahora' }
                        : x,
                    ),
                  );
                setEdit(null);
              }}
            >
              Guardar cambios
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <AlertDialog
        open={!!pendingDelete}
        onOpenChange={(v) => !v && setPendingDelete(null)}
      >
        <AlertDialogContent className="pm-confirm">
          <AlertDialogHeader>
            <AlertDialogMedia className="pm-confirm-icon warning">
              <Trash2 />
            </AlertDialogMedia>
            <AlertDialogTitle>¿Mover a la papelera?</AlertDialogTitle>
            <AlertDialogDescription>
              <b>{pendingDelete?.client}</b> dejará de aparecer en Mis
              presupuestos. Podrás restaurarlo durante los próximos 7 días.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="pm-sunset-action"
              onClick={() => {
                if (pendingDelete) move(pendingDelete);
                setPendingDelete(null);
              }}
            >
              Sí, mover a la papelera
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
function Context({ title, rows }: { title: string; rows: string[][] }) {
  const [open, setOpen] = useState(true);
  return (
    <section className="pm-context-sec">
      <button onClick={() => setOpen(!open)}>
        <b>{title}</b>
        <ChevronDown className={open ? 'up' : ''} />
      </button>
      {open && (
        <div>
          {rows.map((x) => (
            <p key={x[0]}>
              <span>
                {x[0]}
                <small>{x[1]}</small>
              </span>
              <Src>{x[2]}</Src>
            </p>
          ))}
        </div>
      )}
    </section>
  );
}
function Options({
  values,
  choose,
}: {
  values: string[];
  choose: (x: string) => void;
}) {
  return (
    <div className="pm-options">
      {values.map((x) => (
        <button onClick={() => choose(x)} key={x}>
          {x}
          <ChevronRight />
        </button>
      ))}
    </div>
  );
}
function Message({ m }: { m: Msg }) {
  return (
    <div className={`pm-msg pm-role-${m.who}`}>
      {m.who === 'preco' && (
        <span className="pm-ai">
          <Sparkles />
        </span>
      )}
      <div>
        <b>{m.who === 'preco' ? 'PRECO' : ''}</b>
        <p>{m.text}</p>
        {m.kind === 'risk' && (
          <aside>
            <AlertTriangle />
            <span>
              <b>Factores a profundizar</b>Escala · Multiempresa · Compras del
              exterior
            </span>
          </aside>
        )}
        {m.kind === 'doc' && m.who === 'preco' && (
          <aside className="doc">
            <FileText />
            <span>
              <b>Documento procesado</b>5 datos y 2 tablas detectadas
            </span>
          </aside>
        )}
        <small>{m.time || '10:24'}</small>
      </div>
    </div>
  );
}
function AgentProgress() {
  return (
    <div className="pm-progress">
      <header>
        <span className="pm-ai">
          <Sparkles />
        </span>
        <b>PRECO está preparando la estimación</b>
      </header>
      {[
        'Analizando información del caso',
        'Consultando históricos comparables',
        'Evaluando factores de complejidad',
        'Preparando estimación',
      ].map((x, i) => (
        <p className={i < 2 ? 'done' : i === 2 ? 'active' : ''} key={x}>
          <span>{i < 2 ? <Check /> : i === 2 ? '●' : '○'}</span>
          {x}
        </p>
      ))}
    </div>
  );
}
function Chat({ go }: { go: (s: Screen) => void }) {
  type DemoKey = 'agro' | 'logistica' | 'horizonte';
  const demos: Record<
    DemoKey,
    {
      name: string;
      process: string;
      status: string;
      messages: Msg[];
      options: string[];
    }
  > = {
    agro: {
      name: 'Agro Andina',
      process: 'Compras',
      status: 'En relevamiento',
      messages: [
        {
          id: 1,
          who: 'user',
          text: 'Necesito presupuestar la implementación de Compras para Agro Andina.',
          time: '10:18',
        },
        {
          id: 2,
          who: 'preco',
          text: 'Entendido. Identifiqué el rubro Agropecuario y el proceso Compras. ¿Qué tipo de servicio estamos evaluando?',
          time: '10:18',
        },
        {
          id: 3,
          who: 'user',
          text: 'STAR, para 230 usuarios distribuidos en 4 sociedades.',
          time: '10:19',
        },
        {
          id: 4,
          who: 'preco',
          text: 'Con esa escala conviene precisar el alcance. ¿Incluye importaciones, bienes de uso o circuitos de aprobación especiales?',
          time: '10:20',
        },
        {
          id: 5,
          who: 'user',
          text: 'Incluye compras del exterior y aprobaciones por monto.',
          time: '10:21',
        },
        {
          id: 6,
          who: 'preco',
          text: 'Riesgo de subestimación detectado. La escala, la operación multiempresa y las compras del exterior aparecen en casos históricos con mayor esfuerzo. Falta confirmar integraciones y particularizaciones.',
          kind: 'risk',
          time: '10:22',
        },
        {
          id: 7,
          who: 'preco',
          text: '¿Existe alguna integración o particularización del circuito de Compras?',
          time: '10:22',
        },
      ],
      options: [
        'Sin integraciones',
        'Integración con AFIP',
        'Portal de proveedores',
        'Flujo personalizado',
      ],
    },
    logistica: {
      name: 'Logística del Sur',
      process: 'Tesorería',
      status: 'En ejecución',
      messages: [
        {
          id: 21,
          who: 'user',
          text: 'Necesitamos revisar la estimación de Tesorería para Logística del Sur.',
          time: '09:42',
        },
        {
          id: 22,
          who: 'preco',
          text: 'Encontré un servicio ODC sobre OneTeam. ¿Cuántas cuentas bancarias y sociedades forman parte del alcance?',
          time: '09:43',
        },
        {
          id: 23,
          who: 'user',
          text: 'Son 18 cuentas bancarias en 2 sociedades.',
          time: '09:45',
        },
        {
          id: 24,
          who: 'preco',
          text: '¿Habrá conciliación automática, pagos masivos o formatos bancarios particulares?',
          time: '09:46',
        },
        {
          id: 25,
          who: 'user',
          text: 'Pagos masivos y conciliación automática con tres bancos.',
          time: '09:48',
        },
        {
          id: 26,
          who: 'preco',
          text: 'Riesgo de subestimación detectado. Los múltiples formatos bancarios suelen requerir validación técnica y ciclos adicionales de prueba.',
          kind: 'risk',
          time: '09:49',
        },
        {
          id: 27,
          who: 'preco',
          text: '¿Los bancos ya tienen conectores disponibles o se deben desarrollar interfaces?',
          time: '09:49',
        },
      ],
      options: [
        'Conectores disponibles',
        'Una interfaz nueva',
        'Tres interfaces nuevas',
      ],
    },
    horizonte: {
      name: 'Grupo Horizonte',
      process: 'Ventas',
      status: 'Estimado',
      messages: [
        {
          id: 41,
          who: 'user',
          text: 'Quiero validar el presupuesto de Ventas para Grupo Horizonte.',
          time: '15:10',
        },
        {
          id: 42,
          who: 'preco',
          text: 'El caso figura como IMAS sobre DAI. ¿Qué canales de venta están incluidos?',
          time: '15:11',
        },
        {
          id: 43,
          who: 'user',
          text: 'Venta directa, distribuidores y comercio electrónico.',
          time: '15:13',
        },
        {
          id: 44,
          who: 'preco',
          text: '¿Manejan múltiples listas de precios, promociones o reglas comerciales por canal?',
          time: '15:14',
        },
        {
          id: 45,
          who: 'user',
          text: 'Sí, listas por distribuidor y promociones mensuales.',
          time: '15:15',
        },
        {
          id: 46,
          who: 'preco',
          text: 'Detecté un posible incremento de complejidad por reglas comerciales y múltiples canales. Conviene confirmar volumen e integración con e-commerce.',
          kind: 'risk',
          time: '15:16',
        },
        {
          id: 47,
          who: 'preco',
          text: '¿Cómo se integrará el canal de comercio electrónico?',
          time: '15:16',
        },
      ],
      options: ['API estándar', 'Integración a medida', 'Carga manual inicial'],
    },
  };
  const [selected, setSelected] = useState<DemoKey>('agro');
  const [msgs, setMsgs] = useState<Msg[]>(demos.agro.messages);
  const [stage, setStage] = useState(4);
  const [draft, setDraft] = useState('');
  const [busy, setBusy] = useState(false);
  const [rail, setRail] = useState(true);
  const file = useRef<HTMLInputElement>(null);
  const end = useRef<HTMLDivElement>(null);
  const current = demos[selected];
  useEffect(() => {
    end.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [msgs, stage, busy]);
  const load = (key: DemoKey) => {
    setSelected(key);
    setMsgs(demos[key].messages);
    setStage(4);
    setBusy(false);
    setDraft('');
  };
  const restore = () => load(selected);
  const reset = () => {
    setMsgs([]);
    setStage(0);
    setBusy(false);
    setDraft('');
  };
  const blank = reset;
  const add = (who: 'user' | 'preco', text: string, kind?: Msg['kind']) =>
    setMsgs((x) => [
      ...x,
      { id: Date.now() + x.length, who, text, kind, time: 'Ahora' },
    ]);
  const reply = (text: string, kind?: Msg['kind']) =>
    setTimeout(() => add('preco', text, kind), 220);
  const choose = (x: string) => {
    add('user', x);
    const next =
      selected === 'agro'
        ? 'Perfecto. Voy a contrastar la integración, el volumen y las particularizaciones con históricos comparables.'
        : selected === 'logistica'
          ? 'Anotado. Voy a considerar el esfuerzo técnico de los conectores y los ciclos de prueba bancaria.'
          : 'Perfecto. Voy a contrastar el tipo de integración y las reglas comerciales con proyectos similares.';
    reply(next);
    setStage(6);
  };
  const run = () => {
    setBusy(true);
    setTimeout(() => go('result'), 1400);
  };
  const attach = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    add('user', `Adjunté ${f.name}`, 'doc');
    reply(
      'Documento procesado. Conservé títulos, texto y tablas, e incorporé los datos detectados al contexto del proyecto.',
      'doc',
    );
    setStage(6);
  };
  const send = () => {
    if (!draft.trim()) return;
    add('user', draft);
    setDraft('');
    reply('Registré el dato y actualicé el contexto vigente del proyecto.');
    setStage(6);
  };
  return (
    <div className={`pm-chat pm-chat-two ${rail ? '' : 'rail-hidden'}`}>
      <aside className="pm-chat-list">
        <header>
          <b>Conversaciones</b>
          <button
            aria-label="Nueva conversación"
            title="Nueva conversación"
            onClick={blank}
          >
            <Plus />
          </button>
        </header>
        <label>
          <Search />
          <Input placeholder="Buscar…" />
        </label>
        {(Object.keys(demos) as DemoKey[]).map((key, i) => {
          const d = demos[key];
          return (
            <button
              className={selected === key ? 'active' : ''}
              onClick={() => load(key)}
              key={key}
            >
              <span className={`pm-client c${i}`}>
                {d.name
                  .split(' ')
                  .map((y) => y[0])
                  .join('')
                  .slice(0, 2)}
              </span>
              <p>
                <b>{d.name}</b>
                <small>{d.status}</small>
              </p>
            </button>
          );
        })}
        <footer>
          <button onClick={() => go('budgets')}>
            <ArrowLeft />
            Mis presupuestos
          </button>
        </footer>
      </aside>
      <section className="pm-convo">
        <header>
          <button
            className="pm-rail-toggle"
            aria-label={
              rail ? 'Ocultar conversaciones' : 'Mostrar conversaciones'
            }
            title={rail ? 'Ocultar conversaciones' : 'Mostrar conversaciones'}
            onClick={() => setRail(!rail)}
          >
            {rail ? <PanelLeftClose /> : <PanelLeftOpen />}
          </button>
          <span className="pm-ai">
            <Sparkles />
          </span>
          <p>
            <b>PRECO</b>
            <small>Agente de presupuestación · Disponible</small>
          </p>
          <select
            className="pm-chat-project-select"
            value={selected}
            onChange={(e) => load(e.target.value as DemoKey)}
          >
            {(Object.keys(demos) as DemoKey[]).map((key) => (
              <option value={key} key={key}>
                {demos[key].name} · {demos[key].process}
              </option>
            ))}
          </select>
          <Badge>
            {current.name} · {current.process}
          </Badge>
          <button
            className="pm-reset-chat"
            onClick={reset}
            title="Reiniciar conversación"
          >
            <RotateCcw />
            <span>Reiniciar</span>
          </button>
        </header>
        <main>
          {!msgs.length ? (
            <EstimationStart
              projectName={current.name}
              onRestore={restore}
              onStart={(data: EstimateInput) => {
                setMsgs([
                  {
                    id: Date.now(),
                    who: 'user',
                    text: `${data.projectType} · ${data.team} · ${data.item} · ${data.users} usuarios · complejidad ${data.complexity.toLowerCase()}${data.manufacturing ? ' · incluye Manufactura' : ''}.`,
                    time: 'Ahora',
                  },
                  {
                    id: Date.now() + 1,
                    who: 'preco',
                    text: `Registré las variables iniciales. Voy a aplicar la fórmula ${data.item.toLowerCase()}.v3. Antes de cerrar el cálculo necesito confirmar integraciones y particularizaciones del alcance.`,
                    time: 'Ahora',
                  },
                ]);
                setStage(4);
              }}
            />
          ) : (
            <div className="pm-stream">
              <em>HOY</em>
              {msgs.map((m) => (
                <Message key={m.id} m={m} />
              ))}
              {stage === 4 && (
                <div className="pm-suggestions">
                  <small>RESPUESTAS SUGERIDAS</small>
                  <Options values={current.options} choose={choose} />
                </div>
              )}{' '}
              {stage === 6 && !busy && (
                <div className="pm-follow">
                  <button onClick={() => file.current?.click()}>
                    <Paperclip />
                    Adjuntar documentación
                  </button>
                  <button onClick={run}>
                    <Sparkles />
                    Consultar históricos y estimar
                  </button>
                </div>
              )}{' '}
              {busy && <AgentProgress />}
              <div ref={end} />
            </div>
          )}
        </main>
        <footer>
          <input
            ref={file}
            hidden
            type="file"
            accept=".pdf,.doc,.docx,.xls,.xlsx,.csv,.txt"
            onChange={attach}
          />
          <div>
            <button
              aria-label="Adjuntar documento"
              onClick={() => file.current?.click()}
            >
              <Paperclip />
            </button>
            <Textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Respondé o agregá información para PRECO…"
            />
            <button aria-label="Enviar mensaje" onClick={send}>
              <Send />
            </button>
          </div>
          <small>
            PRECO muestra conclusiones y evidencia; nunca expone razonamiento
            interno.
          </small>
        </footer>
      </section>
    </div>
  );
}
function Result({
  go,
  confirm,
}: {
  go: (s: Screen) => void;
  confirm: (h: string) => void;
}) {
  const [evidence, setEvidence] = useState(false);
  const [modify, setModify] = useState(false);
  const [hours, setHours] = useState('88');
  const [reason, setReason] = useState('');
  const [v2, setV2] = useState(false);
  return (
    <div className="pm-page pm-result">
      <button className="pm-back" onClick={() => go('chat')}>
        <ArrowLeft />
        Volver a la conversación
      </button>
      <div className="pm-result-title">
        <div>
          <small>AGRO ANDINA · COMPRAS</small>
          <h1>Estimación técnica sugerida</h1>
          <p>Resultado explicable basado en evidencia disponible.</p>
        </div>
        <span>V1 {v2 && '· V2 ajustada'}</span>
      </div>
      <section className="pm-result-hero">
        <div>
          <small>RANGO DE ESFUERZO TÉCNICO</small>
          <h2>
            {v2 ? `${+hours - 4}–${+hours + 4}` : '82–94'} <span>horas</span>
          </h2>
          <p>
            Valor de referencia: <b>{v2 ? hours : '88'} h</b>
          </p>
        </div>
        <div className="pm-coverage">
          <span>
            <b>8 de 10</b>
            <small>variables clave confirmadas</small>
          </span>
          <p>
            <b>Calidad de información: Alta</b>Faltan 2 variables para mejorar
            la precisión.
          </p>
        </div>
        <aside>
          <Button variant="outline" onClick={() => setModify(true)}>
            <Pencil />
            Modificar
          </Button>
          <Button onClick={() => confirm(v2 ? hours : '88')}>
            <Check />
            Confirmar estimación
          </Button>
        </aside>
      </section>
      <div className="pm-result-grid">
        <main>
          <section className="pm-card">
            <header>
              <h2>Evidencia utilizada</h2>
              <p>Fuentes consideradas para construir el rango.</p>
            </header>
            <div className="pm-evidence">
              {[
                [
                  History,
                  '12 casos históricos comparables',
                  'STAR, ODC e IMAS',
                  'Histórico',
                ],
                [
                  MessageSquareText,
                  'Información relevada',
                  'Conversación',
                  'Confirmado',
                ],
                [
                  FileText,
                  'Variables del cliente',
                  'RFP y tablas',
                  'Documento',
                ],
                [
                  Layers3,
                  'Alcance funcional',
                  'Compras y subprocesos',
                  'Confirmado',
                ],
              ].map(([Icon, a, b, c]) => (
                <article key={a as string}>
                  <Icon />
                  <span>
                    <b>{a as string}</b>
                    <small>{b as string}</small>
                  </span>
                  <Src>{c as string}</Src>
                </article>
              ))}
            </div>
            <Button variant="outline" onClick={() => setEvidence(true)}>
              Ver evidencia utilizada <ArrowRight />
            </Button>
          </section>
          <section className="pm-card">
            <header>
              <h2>Factores relevantes</h2>
              <p>Sin asignar una fórmula aún no validada.</p>
            </header>
            <div className="pm-factors">
              {[
                ['Escala', '230 licencias', 'Documento'],
                ['Particularizaciones', 'Pendiente', 'Pendiente'],
                ['Volumen', '1.800 operaciones / mes', 'Documento'],
                [
                  'Complejidad',
                  'Exterior · Multiempresa',
                  'Inferido por PRECO',
                ],
                ['Antecedentes', 'Desvíos por integraciones', 'Histórico'],
              ].map((x) => (
                <p key={x[0]}>
                  <span>
                    <b>{x[0]}</b>
                    <small>{x[1]}</small>
                  </span>
                  <Src>{x[2]}</Src>
                </p>
              ))}
            </div>
          </section>
        </main>
        <aside>
          <section className="pm-card pm-cases">
            <header>
              <h2>Históricos comparables</h2>
              <p>Mock data del prototipo</p>
              <Badge>12 encontrados</Badge>
            </header>
            {cases.slice(0, 3).map((x) => (
              <div key={x[0]}>
                <span>
                  <b>{x[0]}</b>
                  <small>
                    {x[1]} · {x[2]}
                  </small>
                </span>
                <p>
                  <small>Presup.</small>
                  <b>{x[3]}</b>
                </p>
                <p>
                  <small>Ejecut.</small>
                  <b>{x[4]}</b>
                </p>
              </div>
            ))}
            <button onClick={() => setEvidence(true)}>
              Ver todos <ArrowRight />
            </button>
          </section>
          <section className="pm-commercial">
            <BriefcaseBusiness />
            <div>
              <h3>Gestión / ajustes comerciales</h3>
              <p>Pendiente según reglas comerciales validadas.</p>
              <small>Separado de la estimación técnica.</small>
            </div>
          </section>
          <section className="pm-pending">
            <Info />
            <p>
              <b>Información pendiente</b>Particularizaciones e integraciones.
            </p>
          </section>
        </aside>
      </div>
      <Sheet open={evidence} onOpenChange={setEvidence}>
        <SheetContent className="pm-sheet">
          <SheetHeader>
            <SheetTitle>Evidencia utilizada</SheetTitle>
            <SheetDescription>
              Casos ficticios; no representan datos reales de Finnegans.
            </SheetDescription>
          </SheetHeader>
          <table>
            <thead>
              <tr>
                <th>CASO</th>
                <th>SERVICIO</th>
                <th>PROCESO</th>
                <th>PRESUP.</th>
                <th>EJECUTADO</th>
              </tr>
            </thead>
            <tbody>
              {cases.map((x) => (
                <tr key={x[0]}>
                  {x.map((y) => (
                    <td key={y}>{y}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </SheetContent>
      </Sheet>
      <Dialog open={modify} onOpenChange={setModify}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modificar estimación</DialogTitle>
            <DialogDescription>
              Se guardará una nueva versión con trazabilidad.
            </DialogDescription>
          </DialogHeader>
          <label className="pm-field">
            Horas
            <Input
              type="number"
              value={hours}
              onChange={(e) => setHours(e.target.value)}
            />
          </label>
          <label className="pm-field">
            Motivo
            <Textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="El especialista considera que requiere mayor acompañamiento."
            />
          </label>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModify(false)}>
              Cancelar
            </Button>
            <Button
              disabled={!reason.trim()}
              onClick={() => {
                setV2(true);
                setModify(false);
              }}
            >
              Guardar como V2
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
function Feedback({
  done,
  go,
}: {
  done: (real: string, cause: string) => void;
  go: (s: Screen) => void;
}) {
  const [real, setReal] = useState('142');
  const [cause, setCause] = useState('');
  const [comment, setComment] = useState('');
  const causes = [
    'Alcance ampliado',
    'Datos de origen',
    'Integración no prevista',
    'Mayor complejidad técnica',
  ];
  return (
    <div className="pm-page pm-feedback">
      <Head
        over="APRENDIZAJE CONTINUO"
        title="Cierre del proyecto"
        sub="Compará la estimación con la ejecución y sumá contexto útil para próximos presupuestos."
      />
      <section className="pm-feedback-hero">
        <div>
          <small>PROYECTO</small>
          <h2>Logística del Sur · Tesorería</h2>
          <p>ODC · OneTeam · Responsable: Martín Ríos</p>
        </div>
        <Stat>En ejecución</Stat>
      </section>
      <div className="pm-compare">
        <article>
          <small>HORAS ESTIMADAS</small>
          <strong>128 h</strong>
          <p>Versión confirmada</p>
        </article>
        <article>
          <small>HORAS REALES</small>
          <label>
            <Input
              type="number"
              value={real}
              onChange={(e) => setReal(e.target.value)}
            />{' '}
            <b>h</b>
          </label>
          <p>Cargá el total ejecutado</p>
        </article>
        <article className="warn">
          <small>DESVÍO</small>
          <strong>+{Math.max(0, Number(real || 0) - 128)} h</strong>
          <p>
            {real && Number(real) > 128
              ? `+${Math.round(((Number(real) - 128) / 128) * 100)}% sobre lo estimado`
              : 'Sin desvío positivo'}
          </p>
        </article>
      </div>
      <section className="pm-feedback-card">
        <div>
          <small>RETROALIMENTACIÓN PARA PRECO</small>
          <h2>¿Qué explicó el desvío?</h2>
          <p>
            Esta información se incorpora como antecedente para mejorar futuras
            estimaciones comparables.
          </p>
        </div>
        <div className="pm-cause-grid">
          {causes.map((x) => (
            <button
              key={x}
              className={cause === x ? 'selected' : ''}
              onClick={() => setCause(x)}
            >
              <span>{cause === x ? <Check /> : <i />}</span>
              {x}
            </button>
          ))}
        </div>
        <label className="pm-field">
          Comentario adicional (opcional)
          <Textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Ej.: se incorporaron dos interfaces bancarias durante la ejecución."
          />
        </label>
        <div className="pm-feedback-note">
          <Sparkles />
          <p>
            <b>PRECO aprende del resultado</b>
            <small>
              Se guardarán la estimación, las horas reales y la causa
              seleccionada como evidencia histórica.
            </small>
          </p>
        </div>
        <footer>
          <Button variant="outline" onClick={() => go('budgets')}>
            Volver sin finalizar
          </Button>
          <Button disabled={!real || !cause} onClick={() => done(real, cause)}>
            <Check />
            Finalizar y guardar feedback
          </Button>
        </footer>
      </section>
    </div>
  );
}
function Trash({
  items,
  restore,
  remove,
}: {
  items: Budget[];
  restore: (b: Budget) => void;
  remove: (id: number) => void;
}) {
  const [pending, setPending] = useState<{
    item: Budget;
    action: 'restore' | 'remove';
  } | null>(null);
  const restoring = pending?.action === 'restore';
  return (
    <div className="pm-page">
      <Head
        over="SECUNDARIO"
        title="Papelera"
        sub="Los presupuestos eliminados se conservan durante 7 días."
      />
      <div className="pm-trash-info">
        <Clock3 />
        Antes de cada acción te pediremos confirmación para evitar cambios
        accidentales.
      </div>
      <section className="pm-trash">
        {items.map((b) => (
          <div key={b.id}>
            <span className="pm-client">
              {b.client
                .split(' ')
                .map((x) => x[0])
                .join('')
                .slice(0, 2)}
            </span>
            <p>
              <b>{b.client}</b>
              <small>
                {b.service} · {b.process}
              </small>
            </p>
            <Stat>6 días restantes</Stat>
            <Button
              variant="outline"
              onClick={() => setPending({ item: b, action: 'restore' })}
            >
              <ArchiveRestore />
              Restaurar
            </Button>
            <Button
              variant="ghost"
              aria-label={`Eliminar definitivamente ${b.client}`}
              title="Eliminar definitivamente"
              onClick={() => setPending({ item: b, action: 'remove' })}
            >
              <Trash2 />
            </Button>
          </div>
        ))}
        {!items.length && (
          <aside className="pm-empty">
            <Trash2 />
            <b>La papelera está vacía</b>
            <p>Los presupuestos que elimines aparecerán acá durante 7 días.</p>
          </aside>
        )}
      </section>
      <AlertDialog
        open={!!pending}
        onOpenChange={(v) => !v && setPending(null)}
      >
        <AlertDialogContent className="pm-confirm">
          <AlertDialogHeader>
            <AlertDialogMedia
              className={`pm-confirm-icon ${restoring ? 'restore' : 'danger'}`}
            >
              {restoring ? <ArchiveRestore /> : <AlertTriangle />}
            </AlertDialogMedia>
            <AlertDialogTitle>
              {restoring
                ? '¿Restaurar presupuesto?'
                : '¿Eliminar definitivamente?'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {restoring ? (
                <>
                  <b>{pending?.item.client}</b> volverá a aparecer en Mis
                  presupuestos con toda su información.
                </>
              ) : (
                <>
                  Esta acción eliminará <b>{pending?.item.client}</b> de forma
                  permanente y no se podrá deshacer.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className={restoring ? 'pm-primary-action' : 'pm-danger-action'}
              onClick={() => {
                if (!pending) return;
                if (restoring) restore(pending.item);
                else remove(pending.item.id);
                setPending(null);
              }}
            >
              {restoring ? 'Sí, restaurar' : 'Eliminar definitivamente'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
function SettingsView() {
  const [saved, setSaved] = useState(false);
  const [name, setName] = useState('Lucía Martínez');
  const [email, setEmail] = useState('lucia.martinez@finnegans.com');
  const [area, setArea] = useState('Implementaciones');
  const [phone, setPhone] = useState('+54 11 4321 8890');
  return (
    <div className="pm-page pm-profile">
      <Head
        over="CUENTA DE USUARIO"
        title="Mi perfil"
        sub="Actualizá la información visible para el equipo de presupuestación."
      />
      {saved && (
        <div className="pm-note">
          <Check />
          Perfil actualizado correctamente.
        </div>
      )}
      <section className="pm-profile-card">
        <header>
          <div className="pm-avatar">LM</div>
          <div>
            <h2>{name}</h2>
            <p>Líder de implementación</p>
            <span>
              <ShieldCheck />
              Usuario interno Finnegans
            </span>
          </div>
        </header>
        <div className="pm-profile-form">
          <label className="pm-field">
            Nombre y apellido
            <Input
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setSaved(false);
              }}
            />
          </label>
          <label className="pm-field">
            Correo corporativo
            <div className="pm-input-icon">
              <Mail />
              <Input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setSaved(false);
                }}
              />
            </div>
          </label>
          <label className="pm-field">
            Área o equipo
            <Input
              value={area}
              onChange={(e) => {
                setArea(e.target.value);
                setSaved(false);
              }}
            />
          </label>
          <label className="pm-field">
            Teléfono de contacto
            <Input
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);
                setSaved(false);
              }}
            />
          </label>
          <label className="pm-field">
            Rol
            <Input value="Líder / presupuestador" disabled />
            <small>El rol es administrado por Finnegans.</small>
          </label>
        </div>
        <footer>
          <p>
            <Info />
            Los cambios solo afectan tu perfil de usuario.
          </p>
          <Button
            disabled={!name.trim() || !email.trim()}
            onClick={() => setSaved(true)}
          >
            Guardar perfil
          </Button>
        </footer>
      </section>
    </div>
  );
}
function MobileNav({
  screen,
  go,
}: {
  screen: Screen;
  go: (s: Screen) => void;
}) {
  const estimating = screen === 'chat' || screen === 'result';
  return (
    <nav className="pm-mobile-nav" aria-label="Navegación principal">
      <button
        className={screen === 'budgets' ? 'active' : ''}
        onClick={() => go('budgets')}
      >
        <FolderKanban />
        <span>Presupuestos</span>
      </button>
      <button className={estimating ? 'active' : ''} onClick={() => go('chat')}>
        <Sparkles />
        <span>Estimar</span>
      </button>
      <button
        className={screen === 'trash' ? 'active' : ''}
        onClick={() => go('trash')}
      >
        <Trash2 />
        <span>Papelera</span>
      </button>
      <button
        className={screen === 'settings' ? 'active' : ''}
        onClick={() => go('settings')}
      >
        <UserRound />
        <span>Mi perfil</span>
      </button>
    </nav>
  );
}
export default function PrecoMVP() {
  const [screen, setScreen] = useState<Screen>('budgets');
  const [menu, setMenu] = useState(false);
  const [items, setItems] = useState(seed);
  const [activeProject, setActiveProject] = useState<Budget>(seed[0]);
  const [trash, setTrash] = useState<Budget[]>([]);
  const [note, setNote] = useState('');
  const go = (s: Screen) => {
    setScreen(s);
    setNote('');
  };
  const openProject = (project: Budget) => {
    setActiveProject(project);
    setScreen('project');
    setNote('');
  };
  const move = (b: Budget) => {
    setItems((x) => x.filter((y) => y.id !== b.id));
    setTrash((x) => [b, ...x]);
    setNote(`${b.client} se movió a la Papelera.`);
  };
  const restore = (b: Budget) => {
    setTrash((x) => x.filter((y) => y.id !== b.id));
    setItems((x) => [b, ...x]);
  };
  const finish = (real: string, cause: string) => {
    setItems((x) =>
      x.map((b) =>
        b.id === 2 ? { ...b, status: 'Finalizado', updated: 'Ahora' } : b,
      ),
    );
    setNote('Proyecto finalizado: ' + real + ' h reales · ' + cause + '.');
    setScreen('budgets');
  };
  const confirm = (h: string) => {
    setItems((x) =>
      x.map((b) =>
        b.id === 1
          ? { ...b, status: 'Confirmado', estimate: `${h} h`, updated: 'Ahora' }
          : b,
      ),
    );
    setNote('Estimación confirmada y presupuesto guardado.');
    setScreen('budgets');
  };
  return (
    <main className={`pm-app screen-${screen}`}>
      <Side screen={screen} go={go} open={menu} close={() => setMenu(false)} />
      <div className="pm-work">
        <Top screen={screen} menu={() => setMenu(true)} />
        <div className="pm-scroll">
          {screen === 'budgets' && (
            <Budgets
              items={items}
              setItems={setItems}
              move={move}
              go={go}
              note={note}
              openProject={openProject}
            />
          )}{' '}
          {screen === 'project' && (
            <ProjectView project={activeProject} go={go} />
          )}{' '}
          {screen === 'chat' && <Chat go={go} />}{' '}
          {screen === 'result' && (
            <EstimationResult go={go} confirm={confirm} />
          )}{' '}
          {screen === 'feedback' && <Feedback done={finish} go={go} />}{' '}
          {screen === 'trash' && (
            <Trash
              items={trash}
              restore={restore}
              remove={(id) => setTrash((x) => x.filter((y) => y.id !== id))}
            />
          )}{' '}
          {screen === 'settings' && <SettingsView />}
        </div>
      </div>
      <MobileNav screen={screen} go={go} />
    </main>
  );
}
