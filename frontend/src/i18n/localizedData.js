const LOCALIZED_WORKSPACES = {
  es: {
    ws1: {
      name: 'Research de producto',
      description: 'Análisis competitivo, entrevistas de usuario y research de mercado para el lanzamiento de Q2.',
      tags: ['research', 'producto'],
    },
    ws2: {
      name: 'Legal y compliance',
      description: 'Contratos, NDA, términos de servicio y documentación regulatoria.',
      tags: ['legal', 'compliance'],
    },
    ws3: {
      name: 'Documentación de ingeniería',
      description: 'Especificaciones técnicas, decisiones de arquitectura y documentación de APIs.',
      tags: ['ingeniería', 'técnico'],
    },
    ws4: {
      name: 'Estrategia de marketing',
      description: 'Briefings de campaña, guías de marca y estrategias de contenido.',
      tags: ['marketing', 'marca'],
    },
    ws5: {
      name: 'Relación con inversores',
      description: 'Pitch decks, informes financieros y materiales de due diligence.',
      tags: ['finanzas', 'inversores'],
    },
    ws6: {
      name: 'Onboarding de equipo',
      description: 'Manual del empleado, materiales de formación y documentación de procesos.',
      tags: ['rrhh', 'onboarding'],
    },
  },
}

const LOCALIZED_NOTES = {
  es: {
    n1: {
      title: 'Hallazgos clave de las entrevistas',
      content: 'Los usuarios mencionan de forma constante el coste de cambiar de herramienta para encontrar información. La necesidad principal es una única fuente de verdad que pueda "responder preguntas" sobre sus propios documentos...\n\nFunciones más pedidas:\n- Búsqueda en lenguaje natural\n- Auto-resúmenes\n- Conexiones entre documentos',
      preview: 'Los usuarios mencionan de forma constante el coste de cambiar de herramienta...',
      tags: ['hallazgos', 'ux'],
    },
    n2: {
      title: 'Ideas sobre posicionamiento competitivo',
      content: 'Nuestro diferencial frente a NotebookLM es una mejor capa de organización con workspaces. Frente a Notion AI, realmente leemos y procesamos documentos, no solo notas.',
      preview: 'Nuestro diferencial frente a NotebookLM es una mejor capa de organización...',
      tags: ['estrategia', 'posicionamiento'],
    },
    n3: {
      title: 'Resumen: cláusulas clave del MSA',
      content: 'Resumen generado por IA de las obligaciones contractuales y las zonas de riesgo del Master Service Agreement...',
      preview: 'Resumen generado por IA de las obligaciones contractuales...',
      tags: ['legal', 'resumen'],
    },
    n4: {
      title: 'Principios de diseño de APIs',
      content: 'REST primero y GraphQL cuando las consultas complejas lo justifiquen. Versionar APIs desde el primer día. Los códigos de error deben ser descriptivos y consistentes.',
      preview: 'REST primero y GraphQL cuando las consultas complejas lo justifiquen...',
      tags: ['api', 'ingeniería'],
    },
    n5: {
      title: 'Notas de reunión — sync de producto 8 mar',
      content: 'Se han revisado las prioridades de Q2. El chat es la prioridad principal. La resumición debe soportar workspaces con varios documentos. La vista móvil se pospone a Q3.',
      preview: 'Se han revisado las prioridades de Q2. El chat es la prioridad principal...',
      tags: ['reunión', 'producto'],
    },
  },
}

const LOCALIZED_SUMMARIES = {
  es: {
    s1: {
      title: 'Visión general del panorama competitivo',
      content: 'El mercado de gestión del conocimiento crece con rapidez y concentra 12 competidores repartidos entre herramientas centradas en documentos, notas con IA y búsqueda empresarial. El campo de batalla está en la intersección entre comprensión documental y conversación. Ningún jugador combina bien organización por workspace e inteligencia documental profunda.',
    },
    s2: {
      title: 'Resumen del workspace: Research de producto',
      content: 'Este workspace reúne 14 documentos sobre inteligencia competitiva y research con usuarios. Temas clave: (1) oportunidad de mercado en un espacio de 2,3B$, (2) dolor claro por el cambio de contexto y los silos documentales, (3) hueco competitivo para una herramienta que combine organización e IA. Próximos pasos: cerrar el posicionamiento y definir el MVP.',
    },
  },
}

const LOCALIZED_DOCUMENTS = {
  es: {
    doc1: {
      summary: 'Análisis completo de 12 competidores en el espacio de gestión del conocimiento, incluyendo comparación funcional, modelos de precio y posicionamiento de mercado.',
      tags: ['análisis', 'competidores'],
    },
    doc2: {
      summary: 'Notas en bruto y hallazgos clave de 18 entrevistas con usuarios realizadas en enero de 2024. Recoge pain points, solicitudes de funcionalidades y patrones de trabajo.',
      tags: ['ux', 'research'],
    },
    doc3: {
      tags: ['mercado', 'research'],
    },
    doc4: {
      summary: 'Plantilla estándar de MSA que cubre responsabilidad, propiedad intelectual, pagos y cláusulas de terminación.',
      tags: ['contrato', 'legal'],
    },
    doc5: {
      summary: 'Colección de 14 ADRs que documentan decisiones clave de arquitectura tomadas entre Q3 de 2023 y Q1 de 2024.',
      tags: ['arquitectura', 'adr'],
    },
    doc6: {
      tags: ['roadmap', 'producto'],
    },
  },
}

function withLocalizedFields(item, language, collection) {
  const localized = collection[language]?.[item.id]
  if (!localized) return item
  return { ...item, ...localized }
}

export function localizeWorkspace(workspace, language) {
  return withLocalizedFields(workspace, language, LOCALIZED_WORKSPACES)
}

export function localizeNote(note, language) {
  return withLocalizedFields(note, language, LOCALIZED_NOTES)
}

export function localizeSummary(summary, language) {
  return withLocalizedFields(summary, language, LOCALIZED_SUMMARIES)
}

export function localizeDocument(document, language) {
  return withLocalizedFields(document, language, LOCALIZED_DOCUMENTS)
}
