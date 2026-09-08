'use client';
import { useMemo, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Database,
  FileClock,
  Info,
  RefreshCw,
  Settings2,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

type Screen =
  | 'budgets'
  | 'project'
  | 'chat'
  | 'result'
  | 'feedback'
  | 'trash'
  | 'settings';
export default function EstimationResult({
  go,
  confirm,
}: {
  go: (s: Screen) => void;
  confirm: (hours: string) => void;
}) {
  const [users, setUsers] = useState(220);
  const [complexity, setComplexity] = useState('Alta');
  const calc = useMemo(() => {
    const base =
      40 +
      (users > 250 ? 8 : 0) +
      (complexity === 'Alta' ? 0 : complexity === 'Media' ? -4 : -8);
    const management = Math.round(base * 0.2);
    const uat = Math.round(base * 0.2);
    const margin = 6;
    return {
      base,
      management,
      uat,
      margin,
      total: base + management + uat + margin,
    };
  }, [users, complexity]);
  const changed = users !== 220 || complexity !== 'Alta';
  return (
    <div className="pm-page pm-result pm-result-v1">
      <button className="pm-back" onClick={() => go('chat')}>
        <ArrowLeft />
        Volver a la conversación
      </button>
      <div className="pm-result-title">
        <div>
          <small>AGRO ANDINA · COMPRAS · STAR</small>
          <h1>Estimación calculada</h1>
          <p>
            Resultado determinístico generado con reglas administradas por
            negocio.
          </p>
        </div>
        <span>Fórmula compras.v3</span>
      </div>
      <section className="pm-v1-total">
        <div>
          <small>HORAS TOTALES</small>
          <h2>
            {calc.total}
            <span> h</span>
          </h2>
          <p>
            {changed ? 'Escenario recalculado' : 'Escenario inicial'} · 220
            usuarios como referencia
          </p>
        </div>
        <div className="pm-formula-status">
          <Settings2 />
          <span>
            <b>compras.v3</b>
            <small>Vigente desde 01/09/2026</small>
          </span>
          <Badge>Auditable</Badge>
        </div>
        <aside>
          <Button variant="outline" onClick={() => go('chat')}>
            <Sparkles />
            Ajustar en el chat
          </Button>
          <Button onClick={() => confirm(String(calc.total))}>
            <Check />
            Confirmar estimación
          </Button>
        </aside>
      </section>
      <div className="pm-result-grid pm-v1-grid">
        <main>
          <section className="pm-card pm-formula-breakdown">
            <header>
              <h2>Desglose de la fórmula</h2>
              <p>
                Cada concepto conserva la regla y el coeficiente que lo generó.
              </p>
            </header>
            {[
              ['Consultoría base', calc.base + ' h', 'Base del ítem Compras'],
              ['Gestión', calc.management + ' h', '20% sobre consultoría base'],
              ['UAT', calc.uat + ' h', '20% sobre consultoría base'],
              ['Margen', calc.margin + ' h', 'Coeficiente del segmento'],
            ].map((x, i) => (
              <article key={x[0]}>
                <span className={'pm-break-index i' + i}>0{i + 1}</span>
                <div>
                  <b>{x[0]}</b>
                  <small>{x[2]}</small>
                </div>
                <strong>{x[1]}</strong>
              </article>
            ))}
            <footer>
              <span>Total generado por compras.v3</span>
              <strong>{calc.total} h</strong>
            </footer>
          </section>
          <section className="pm-card pm-explanation">
            <header>
              <h2>Cómo se obtuvo</h2>
              <p>
                Explicación visible para el usuario, sin exponer razonamiento
                interno.
              </p>
            </header>
            <p>
              La fórmula parte de <b>{calc.base} h de consultoría</b> para el
              ítem Compras. Agrega <b>{calc.management} h de gestión</b>,{' '}
              <b>{calc.uat} h de UAT</b> y <b>{calc.margin} h de margen</b>. La
              complejidad está marcada como {complexity.toLowerCase()} y el
              escenario considera {users} usuarios.
            </p>
            <div>
              <Info />
              <span>
                <b>Qué movió el resultado</b>
                <small>
                  {users > 250
                    ? 'La escala superó 250 usuarios y elevó la base en 8 horas.'
                    : 'La cantidad de usuarios permanece dentro del tramo base.'}
                </small>
              </span>
            </div>
          </section>
          <section className="pm-card">
            <header>
              <h2>Trazabilidad de la estimación</h2>
              <p>PRECO v1 conserva los insumos exactos utilizados.</p>
            </header>
            <div className="pm-trace-grid">
              {[
                [Settings2, 'Fórmula', 'compras.v3'],
                [Database, 'Dataset', 'Snapshot 2025–2026'],
                [FileClock, 'Generada', 'Hoy, 10:24'],
                [ShieldCheck, 'Gobierno', 'Referente de negocio'],
              ].map(([Icon, a, b]) => (
                <article key={a as string}>
                  <Icon />
                  <span>
                    <small>{a as string}</small>
                    <b>{b as string}</b>
                  </span>
                </article>
              ))}
            </div>
          </section>
          <section className="pm-card pm-comparable-detail">
            <header>
              <h2>Comparables normalizados</h2>
              <p>
                El histórico conserva presupuesto, ejecución, actividad y
                responsable; no sólo un total de horas.
              </p>
            </header>
            <div className="pm-compare-head">
              <span>Proyecto / actividad</span>
              <span>Presup.</span>
              <span>Real</span>
              <span>Desvío</span>
            </div>
            {[
              ['Campo Norte · Relevamiento Compras', '60 h', '72 h', '+20%'],
              ['Río Sur · Configuración Compras', '68 h', '70 h', '+3%'],
              ['Agro Uno · UAT Compras', '55 h', '61 h', '+11%'],
            ].map((row) => (
              <div className="pm-compare-row" key={row[0]}>
                <span>
                  <b>{row[0]}</b>
                  <small>Equipo DAI · Caso certificado</small>
                </span>
                <strong>{row[1]}</strong>
                <strong>{row[2]}</strong>
                <em>{row[3]}</em>
              </div>
            ))}
          </section>
        </main>
        <aside>
          <section className="pm-card pm-scenario-card">
            <header>
              <h2>Probar otro escenario</h2>
              <p>
                El motor recalcula en el momento y mantiene la misma versión de
                fórmula.
              </p>
            </header>
            <label>
              Cantidad de usuarios
              <Input
                type="number"
                min="1"
                value={users}
                onChange={(e) => setUsers(Number(e.target.value))}
              />
            </label>
            <label>
              Complejidad
              <select
                value={complexity}
                onChange={(e) => setComplexity(e.target.value)}
              >
                <option>Alta</option>
                <option>Media</option>
                <option>Baja</option>
              </select>
            </label>
            {changed && (
              <button
                onClick={() => {
                  setUsers(220);
                  setComplexity('Alta');
                }}
              >
                <RefreshCw />
                Restaurar escenario inicial
              </button>
            )}
            <div className="pm-live-total">
              <span>Nuevo total</span>
              <b>{calc.total} h</b>
            </div>
          </section>
          <section className="pm-card pm-v1-sources">
            <header>
              <h2>Fuentes de v1</h2>
            </header>
            <p>
              <Database />
              <span>
                <b>Histórico normalizado</b>
                <small>Proyecto → Etapa → Ítem → Caso</small>
              </span>
              <Check />
            </p>
            <p>
              <Settings2 />
              <span>
                <b>Catálogo ABM</b>
                <small>Variables, fórmulas y coeficientes</small>
              </span>
              <Check />
            </p>
            <p>
              <Sparkles />
              <span>
                <b>RAG</b>
                <small>Previsto para recalibración en v2</small>
              </span>
              <Badge>Próximo</Badge>
            </p>
          </section>
          <section className="pm-card pm-rag-note">
            <Sparkles />
            <div>
              <small>EVOLUCIÓN V2</small>
              <h3>Recalibración gobernada</h3>
              <p>
                RAG sugerirá ajustes con evidencia. Los cambios fuera de umbral
                requerirán aprobación.
              </p>
            </div>
          </section>
          <button className="pm-result-link" onClick={() => go('project')}>
            Ver panel del proyecto
            <ArrowRight />
          </button>
        </aside>
      </div>
    </div>
  );
}
