'use client';
import { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  BriefcaseBusiness,
  Check,
  FileText,
  Info,
  MessageSquareText,
  Paperclip,
  Pencil,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

type Screen =
  | 'budgets'
  | 'project'
  | 'chat'
  | 'result'
  | 'feedback'
  | 'trash'
  | 'settings';
type Project = {
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
const cases = [
  ['Caso A', 'STAR · Compras', '60 h', '72 h'],
  ['Caso B', 'STAR · Compras', '68 h', '70 h'],
  ['Caso C', 'ODC · Compras', '55 h', '74 h'],
];

export default function ProjectView({
  project,
  go,
}: {
  project: Project;
  go: (screen: Screen) => void;
}) {
  const [section, setSection] = useState<
    'summary' | 'plan' | 'scope' | 'evidence'
  >('summary');
  const agro = project.id === 1,
    logistica = project.id === 2;
  const c = agro
    ? {
        industry: 'Agropecuario',
        users: '230',
        companies: '4',
        infra: 'Amazon',
        env: 'DESA · QA · PROD',
        volume: '1.800 operaciones / mes',
        scope: 'Compras productivas, no productivas y compras del exterior',
        risk: 'Escala, operación multiempresa e importaciones',
        coverage: 100,
        range: '62 h',
        ref: 'compras.v3',
      }
    : logistica
      ? {
          industry: 'Logística',
          users: '84',
          companies: '2',
          infra: 'Amazon',
          env: 'DESA · QA · PROD',
          volume: '18 cuentas bancarias',
          scope: 'Pagos masivos, conciliación y formatos bancarios',
          risk: 'Integraciones bancarias y ciclos de prueba',
          coverage: 100,
          range: '128 h',
          ref: '128 h',
        }
      : {
          industry: 'Servicios',
          users: '46',
          companies: '1',
          infra: 'Servidor propio',
          env: 'QA · PROD',
          volume: '650 operaciones / mes',
          scope: project.process + ' estándar con reglas específicas',
          risk: 'Volumen y particularizaciones',
          coverage: 90,
          range: project.estimate === '—' ? 'Pendiente' : project.estimate,
          ref: project.estimate,
        };
  const phases = [
    ['Consultoría base', 'Horas base del ítem Compras', 40],
    ['Gestión', '20% sobre consultoría base', 8],
    ['UAT', '20% sobre consultoría base', 8],
    ['Margen', 'Coeficiente del segmento', 6],
  ];
  const lifecycle = [
    ['01', 'Proyecto', 'Agro Andina', 'Contenedor del presupuesto'],
    ['02', 'Etapa', 'Relevamiento y diseño', 'Agrupa el trabajo'],
    ['03', 'Ítem', project.process, 'Unidad comparable'],
    ['04', 'Caso', 'Relevar · documentar · entregar', 'Horas presupuestadas'],
  ];
  const standardStages = [
    ['01', 'Gestión del proyecto', 8, 8, 'En curso'],
    ['02', 'Diseño de procesos', 18, 12, 'En curso'],
    ['03', 'Configuración y setup', 18, 6, 'En curso'],
    ['04', 'Desarrollos', 6, 0, 'Pendiente'],
    ['05', 'Capacitación', 4, 0, 'Pendiente'],
    ['06', 'UAT', 8, 0, 'Pendiente'],
    ['07', 'PEM y estabilización', 0, 0, 'Pendiente'],
  ];
  const purchaseItems = [
    'Compras de insumos',
    'Compras de servicios',
    'Compras de bienes de uso',
    'Compras del exterior',
    'Compras en consignación',
    'Bot de compras',
    'Impresos',
  ];
  const docs = agro
    ? [
        ['RFP Agro Andina.docx', '8 datos y 2 tablas'],
        ['Alcance Compras.xlsx', '12 procesos detectados'],
        ['Minuta de relevamiento.pdf', '3 pendientes identificados'],
      ]
    : [
        ['Alcance ' + project.process + '.docx', '6 variables detectadas'],
        ['Estimación inicial.xlsx', 'Desglose procesado'],
      ];
  return (
    <div className="pm-page pm-project-page">
      <button className="pm-back" onClick={() => go('budgets')}>
        <ArrowLeft />
        Volver a Mis presupuestos
      </button>
      <header className="pm-project-hero">
        <div>
          <span className="pm-project-code">
            PR-{String(248 - project.id).padStart(4, '0')}
          </span>
          <div>
            <h1>{project.client}</h1>
            <span className="pm-status-pill">{project.status}</span>
          </div>
          <p>
            {project.service} · {project.product} · {project.process} ·
            Responsable: {project.owner}
          </p>
        </div>
        <aside>
          {project.estimate !== '—' && (
            <Button variant="outline" onClick={() => go('result')}>
              <BookOpen />
              Ver estimación
            </Button>
          )}
          <Button onClick={() => go('chat')}>
            <Sparkles />
            Continuar con PRECO
          </Button>
        </aside>
      </header>
      <nav
        className="pm-project-section-nav"
        aria-label="Secciones del proyecto"
      >
        {[
          ['summary', 'Resumen', 'Estado y próximo paso'],
          ['plan', 'Plan y horas', 'Presupuesto y avance'],
          ['scope', 'Alcance', 'Qué está incluido'],
          ['evidence', 'Evidencia', 'Documentos e históricos'],
        ].map(([id, label, help]) => (
          <button
            className={section === id ? 'active' : ''}
            key={id}
            onClick={() => setSection(id as typeof section)}
          >
            <b>{label}</b>
            <small>{help}</small>
          </button>
        ))}
      </nav>

      {section === 'summary' && (
        <>
          <section className="pm-simple-kpis">
            <article className="primary">
              <small>ESTIMACIÓN ACTUAL</small>
              <strong>{c.range}</strong>
              <p>Calculada con la información disponible</p>
            </article>
            <article>
              <small>PRESUPUESTO VIGENTE</small>
              <strong>74 h</strong>
              <p>Incluye 12 h de cambios aprobados</p>
            </article>
            <article>
              <small>AVANCE</small>
              <strong>35%</strong>
              <div className="pm-project-progress">
                <i style={{ width: '35%' }} />
              </div>
              <p>26 de 74 horas ejecutadas</p>
            </article>
          </section>
          <div className="pm-project-layout pm-summary-layout">
            <main>
              <section className="pm-project-card pm-project-guide">
                <header>
                  <div>
                    <small>GUÍA DEL PROYECTO</small>
                    <h2>¿Dónde estamos y qué sigue?</h2>
                    <p>
                      Una lectura simple del proyecto para cualquier integrante
                      del equipo.
                    </p>
                  </div>
                </header>
                <div className="pm-guide-steps">
                  <article className="done">
                    <span>1</span>
                    <div>
                      <b>Información inicial completa</b>
                      <small>
                        Cliente, servicio, producto y escala confirmados.
                      </small>
                    </div>
                    <Check />
                  </article>
                  <article className="done">
                    <span>2</span>
                    <div>
                      <b>Estimación inicial calculada</b>
                      <small>
                        PRECO calculó {c.range} con la fórmula {c.ref}.
                      </small>
                    </div>
                    <Check />
                  </article>
                  <article className="current">
                    <span>3</span>
                    <div>
                      <b>Resolver definiciones pendientes</b>
                      <small>
                        Integraciones externas y desarrollos personalizados.
                      </small>
                    </div>
                    <ArrowRight />
                  </article>
                  <article>
                    <span>4</span>
                    <div>
                      <b>Confirmar presupuesto</b>
                      <small>
                        El responsable valida la versión que irá a ejecución.
                      </small>
                    </div>
                  </article>
                </div>
              </section>
              <section className="pm-project-card pm-overview-scope">
                <header>
                  <div>
                    <small>EN POCAS PALABRAS</small>
                    <h2>Qué se está presupuestando</h2>
                  </div>
                </header>
                <p>
                  <span>Proyecto</span>
                  <b>
                    {project.service} · {project.product}
                  </b>
                </p>
                <p>
                  <span>Proceso principal</span>
                  <b>{project.process}</b>
                </p>
                <p>
                  <span>Alcance</span>
                  <b>{c.scope}</b>
                </p>
                <p>
                  <span>Atención principal</span>
                  <b>{c.risk}</b>
                </p>
              </section>
            </main>
            <aside className="pm-project-aside">
              <section className="pm-project-card pm-pending-card">
                <header>
                  <small>PRÓXIMO PASO</small>
                  <h3>Completar 2 definiciones</h3>
                </header>
                <p>
                  <span>01</span>Confirmar integraciones externas
                </p>
                <p>
                  <span>02</span>Definir desarrollos personalizados
                </p>
                <Button onClick={() => go('chat')}>
                  <MessageSquareText />
                  Resolver con PRECO
                </Button>
              </section>
              <section className="pm-project-card pm-quick-links">
                <header>
                  <small>IR DIRECTO A</small>
                  <h3>Buscá la información</h3>
                </header>
                <button onClick={() => setSection('plan')}>
                  <span>
                    <b>Plan y horas</b>
                    <small>Presupuesto, avance y cambios</small>
                  </span>
                  <ArrowRight />
                </button>
                <button onClick={() => setSection('scope')}>
                  <span>
                    <b>Alcance</b>
                    <small>Variables y procesos incluidos</small>
                  </span>
                  <ArrowRight />
                </button>
                <button onClick={() => setSection('evidence')}>
                  <span>
                    <b>Evidencia</b>
                    <small>Documentos y casos comparables</small>
                  </span>
                  <ArrowRight />
                </button>
              </section>
            </aside>
          </div>
        </>
      )}

      {section === 'plan' && (
        <div className="pm-project-layout">
          <main>
            <section className="pm-section-intro">
              <small>PLAN Y HORAS</small>
              <h2>Cómo se calculó y cómo avanza</h2>
              <p>
                Primero ves el total; debajo podés consultar el detalle de la
                fórmula y cada etapa.
              </p>
            </section>
            <section className="pm-project-card pm-hours-card">
              <header>
                <div>
                  <small>PRESUPUESTO BASE</small>
                  <h2>Desglose de la estimación</h2>
                  <p>De dónde salen las {c.range} iniciales.</p>
                </div>
                <Badge>compras.v3</Badge>
              </header>
              <div className="pm-hours-table">
                {phases.map(([name, detail, hours]) => (
                  <div key={name as string}>
                    <span>
                      <b>{name as string}</b>
                      <small>{detail as string}</small>
                    </span>
                    <i>
                      <em style={{ width: Number(hours) * 3 + '%' }} />
                    </i>
                    <strong>{hours as number} h</strong>
                    <span className="pm-source">Histórico</span>
                  </div>
                ))}
              </div>
              <footer>
                <p>
                  <Info />
                  Cada concepto conserva la regla que lo generó.
                </p>
                <strong>Total 62 h</strong>
              </footer>
            </section>
            <section className="pm-project-card pm-standard-plan">
              <header>
                <div>
                  <small>AVANCE POR ETAPA</small>
                  <h2>Plan estándar Finnegans</h2>
                  <p>Horas previstas, ejecutadas y pendientes.</p>
                </div>
                <Badge>FULL · 7 etapas</Badge>
              </header>
              <div className="pm-stage-table">
                <div className="head">
                  <span>Etapa</span>
                  <span>Prev.</span>
                  <span>Ejec.</span>
                  <span>Pend.</span>
                  <span>Estado</span>
                </div>
                {standardStages.map(([n, name, planned, executed, status]) => (
                  <div key={n as string}>
                    <span>
                      <i>{n as string}</i>
                      <b>{name as string}</b>
                    </span>
                    <strong>{planned as number} h</strong>
                    <strong>{executed as number} h</strong>
                    <strong>
                      {(planned as number) - (executed as number)} h
                    </strong>
                    <em className={status === 'En curso' ? 'active' : ''}>
                      {status as string}
                    </em>
                  </div>
                ))}
              </div>
            </section>
          </main>
          <aside className="pm-project-aside">
            <section className="pm-project-card pm-budget-control">
              <header>
                <small>SEGUIMIENTO</small>
                <h3>Presupuesto vigente</h3>
              </header>
              <div>
                <p>
                  <span>Original</span>
                  <b>62 h</b>
                </p>
                <p>
                  <span>Cambios aprobados</span>
                  <b>+12 h</b>
                </p>
                <p className="total">
                  <span>Actualizado</span>
                  <b>74 h</b>
                </p>
                <p>
                  <span>Ejecutado</span>
                  <b>26 h</b>
                </p>
              </div>
              <div className="pm-control-bar">
                <i style={{ width: '35%' }} />
              </div>
              <small>35% consumido · 48 h disponibles</small>
            </section>
            <section className="pm-project-card pm-change-log">
              <header>
                <small>CONTROL DE CAMBIOS</small>
                <h3>Impactos al presupuesto</h3>
              </header>
              <article>
                <span>
                  <b>CR-04 · Desarrollo</b>
                  <small>Formato proveedor exterior</small>
                </span>
                <strong>+12 h</strong>
                <em>Aprobado</em>
              </article>
              <article>
                <span>
                  <b>CR-05 · No code</b>
                  <small>Nuevo circuito de monto</small>
                </span>
                <strong>+8 h</strong>
                <em className="pending">Pendiente</em>
              </article>
            </section>
          </aside>
        </div>
      )}

      {section === 'scope' && (
        <div className="pm-project-layout">
          <main>
            <section className="pm-section-intro">
              <small>ALCANCE</small>
              <h2>Qué incluye el presupuesto</h2>
              <p>
                Datos del cliente y procesos considerados para evitar supuestos
                ocultos.
              </p>
            </section>
            <section className="pm-project-card pm-context-card">
              <header>
                <div>
                  <small>DATOS CONFIRMADOS</small>
                  <h2>Contexto del proyecto</h2>
                </div>
                <button onClick={() => go('chat')}>
                  <Pencil />
                  Completar con PRECO
                </button>
              </header>
              <div className="pm-variable-grid">
                {[
                  ['Tipo de negocio', c.industry, 'Confirmado'],
                  ['Licencias', c.users, 'Documento'],
                  ['Sociedades', c.companies, 'Confirmado'],
                  ['Infraestructura', c.infra, 'Documento'],
                  ['Ambientes', c.env, 'Documento'],
                  ['Servicio', project.service, 'Confirmado'],
                  ['Producto', project.product, 'Confirmado'],
                  ['Volumen', c.volume, 'Conversación'],
                ].map(([l, v, state]) => (
                  <article key={l}>
                    <small>{l}</small>
                    <b>{v}</b>
                    <span>{state}</span>
                  </article>
                ))}
              </div>
            </section>
            {project.process === 'Compras' && (
              <section className="pm-project-card pm-scope-standard">
                <header>
                  <div>
                    <small>PROCESOS INCLUIDOS</small>
                    <h2>Variantes de Compras</h2>
                    <p>Las marcadas están contempladas en este presupuesto.</p>
                  </div>
                  <Badge>4 de 7</Badge>
                </header>
                <div className="pm-scope-items">
                  {purchaseItems.map((item, index) => (
                    <span className={index < 4 ? 'selected' : ''} key={item}>
                      {index < 4 && <Check />}
                      {item}
                    </span>
                  ))}
                </div>
                <footer>
                  <Info />
                  <span>
                    En FULL se presupuestan variantes concretas. En Small,
                    “Compras” puede mantenerse como agrupador.
                  </span>
                </footer>
              </section>
            )}
          </main>
          <aside className="pm-project-aside">
            <section className="pm-project-card pm-glossary">
              <header>
                <small>AYUDA</small>
                <h3>Cómo leer esta sección</h3>
              </header>
              <p>
                <b>Confirmado</b>
                <span>Informado y validado por una persona.</span>
              </p>
              <p>
                <b>Documento</b>
                <span>Detectado en un archivo adjunto.</span>
              </p>
              <p>
                <b>Conversación</b>
                <span>Obtenido durante el chat con PRECO.</span>
              </p>
            </section>
            <section className="pm-project-card pm-commercial-card">
              <BriefcaseBusiness />
              <div>
                <small>CAPA COMERCIAL</small>
                <h3>Gestión y margen separados</h3>
                <p>Gestión: 12% · Margen: pendiente.</p>
              </div>
            </section>
          </aside>
        </div>
      )}

      {section === 'evidence' && (
        <div className="pm-project-layout">
          <main>
            <section className="pm-section-intro">
              <small>EVIDENCIA</small>
              <h2>En qué información se apoya PRECO</h2>
              <p>
                Documentos del proyecto y antecedentes comparables, separados
                del resultado.
              </p>
            </section>
            <section className="pm-project-card">
              <header>
                <div>
                  <small>DOCUMENTACIÓN</small>
                  <h2>Fuentes analizadas</h2>
                </div>
              </header>
              <div className="pm-project-docs">
                {docs.map(([name, detail]) => (
                  <article key={name}>
                    <FileText />
                    <span>
                      <b>{name}</b>
                      <small>{detail}</small>
                    </span>
                    <Check />
                  </article>
                ))}
              </div>
              <button className="pm-text-action" onClick={() => go('chat')}>
                <Paperclip />
                Adjuntar otro documento
              </button>
            </section>
            <section className="pm-project-card">
              <header>
                <div>
                  <small>ORGANIZACIÓN DEL HISTÓRICO</small>
                  <h2>Cómo se guarda la experiencia</h2>
                </div>
              </header>
              <div className="pm-lifecycle">
                {lifecycle.map(([n, name, status, detail]) => (
                  <article key={n}>
                    <span>{n}</span>
                    <div>
                      <b>{name}</b>
                      <small>{detail}</small>
                    </div>
                    <em>{status}</em>
                  </article>
                ))}
              </div>
            </section>
          </main>
          <aside className="pm-project-aside">
            <section className="pm-project-card pm-history-card">
              <header>
                <small>CASOS COMPARABLES</small>
                <h3>Proyectos usados como referencia</h3>
              </header>
              {cases.map((x) => (
                <article key={x[0]}>
                  <div>
                    <b>{x[0]}</b>
                    <small>{x[1]}</small>
                  </div>
                  <p>
                    <span>Presup.</span>
                    <b>{x[2]}</b>
                  </p>
                  <p>
                    <span>Real</span>
                    <b>{x[3]}</b>
                  </p>
                </article>
              ))}
              <button className="pm-text-action" onClick={() => go('result')}>
                Ver evidencia completa
                <ArrowRight />
              </button>
            </section>
          </aside>
        </div>
      )}
    </div>
  );
}
