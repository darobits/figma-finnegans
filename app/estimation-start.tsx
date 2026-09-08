'use client';
import { useState } from 'react';
import {
  ArrowRight,
  Database,
  RotateCcw,
  Settings2,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export type EstimateInput = {
  projectType: string;
  team: string;
  item: string;
  users: number;
  complexity: string;
  manufacturing: boolean;
  infrastructure: string;
  environments: number;
  background: string;
};

export default function EstimationStart({
  projectName,
  onStart,
  onRestore,
}: {
  projectName: string;
  onStart: (data: EstimateInput) => void;
  onRestore: () => void;
}) {
  const [projectType, setProjectType] = useState('STAR');
  const [team, setTeam] = useState('DAI');
  const [item, setItem] = useState('Compras');
  const [users, setUsers] = useState('220');
  const [complexity, setComplexity] = useState('Alta');
  const [manufacturing, setManufacturing] = useState(true);
  const [infrastructure, setInfrastructure] = useState('Amazon');
  const [environments, setEnvironments] = useState('3');
  const [background, setBackground] = useState('Experiencia estándar');
  return (
    <div className="pm-estimation-start">
      <header>
        <span>
          <Sparkles />
        </span>
        <div>
          <small>NUEVA CONSULTA</small>
          <h2>Datos iniciales de la estimación</h2>
          <p>
            El formulario fija variables válidas. Después podés ajustar el
            escenario conversando con PRECO.
          </p>
        </div>
      </header>
      <div className="pm-start-layout">
        <section className="pm-start-form">
          <label>
            <span>Tipo de proyecto</span>
            <select
              value={projectType}
              onChange={(e) => setProjectType(e.target.value)}
            >
              <option>STAR</option>
              <option>ODC</option>
              <option>IMAS</option>
            </select>
          </label>
          <label>
            <span>Equipo / producto</span>
            <select value={team} onChange={(e) => setTeam(e.target.value)}>
              <option>DAI</option>
              <option>One Team</option>
            </select>
          </label>
          <label>
            <span>Ítem o módulo</span>
            <select value={item} onChange={(e) => setItem(e.target.value)}>
              <option>Compras</option>
              <option>Tesorería</option>
              <option>Ventas</option>
              <option>Contabilidad</option>
              <option>Manufactura</option>
            </select>
          </label>
          <label>
            <span>Cantidad de usuarios</span>
            <Input
              type="number"
              min="1"
              value={users}
              onChange={(e) => setUsers(e.target.value)}
            />
          </label>
          <label>
            <span>Complejidad estimada</span>
            <select
              value={complexity}
              onChange={(e) => setComplexity(e.target.value)}
            >
              <option>Baja</option>
              <option>Media</option>
              <option>Alta</option>
            </select>
          </label>
          <label className="pm-start-check">
            <input
              type="checkbox"
              checked={manufacturing}
              onChange={(e) => setManufacturing(e.target.checked)}
            />
            <span>
              <b>Incluye Manufactura</b>
              <small>Variable adicional del escenario</small>
            </span>
          </label>
          <div className="pm-form-divider">
            <span>Variables de contexto</span>
            <small>Completan la regla sin reemplazar el relevamiento</small>
          </div>
          <label>
            <span>Infraestructura</span>
            <select
              value={infrastructure}
              onChange={(e) => setInfrastructure(e.target.value)}
            >
              <option>Amazon</option>
              <option>Servidor propio</option>
              <option>Híbrida</option>
            </select>
          </label>
          <label>
            <span>Ambientes previstos</span>
            <select
              value={environments}
              onChange={(e) => setEnvironments(e.target.value)}
            >
              <option value="1">PROD</option>
              <option value="2">QA · PROD</option>
              <option value="3">DESA · QA · PROD</option>
            </select>
          </label>
          <label className="pm-start-wide">
            <span>Antecedentes del cliente</span>
            <select
              value={background}
              onChange={(e) => setBackground(e.target.value)}
            >
              <option>Sin antecedentes</option>
              <option>Experiencia estándar</option>
              <option>Antecedentes complejos</option>
            </select>
          </label>
        </section>
        <aside>
          <div className="pm-engine-card">
            <span>
              <Settings2 />
            </span>
            <div>
              <small>MOTOR V1</small>
              <b>Reglas determinísticas</b>
              <p>
                Las variables y fórmulas se administran desde el ABM y quedan
                versionadas.
              </p>
            </div>
          </div>
          <div className="pm-engine-meta">
            <p>
              <Database />
              <span>
                <b>Histórico normalizado</b>
                <small>Snapshot del último año</small>
              </span>
            </p>
            <p>
              <Sparkles />
              <span>
                <b>Fórmula vigente</b>
                <small>{item.toLowerCase()}.v3</small>
              </span>
            </p>
          </div>
          <Button
            disabled={!users || Number(users) < 1}
            onClick={() =>
              onStart({
                projectType,
                team,
                item,
                users: Number(users),
                complexity,
                manufacturing,
                infrastructure,
                environments: Number(environments),
                background,
              })
            }
          >
            Calcular estimación inicial
            <ArrowRight />
          </Button>
          <button className="pm-restore-demo" onClick={onRestore}>
            <RotateCcw />
            Restaurar conversación demo de {projectName}
          </button>
        </aside>
      </div>
    </div>
  );
}
