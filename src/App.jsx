import React, { useState } from 'react';
import {
  Plane,
  Truck,
  Clock,
  Wind,
  ChevronRight,
  Eye,
  RotateCcw,
  Radio,
  Lightbulb,
  Info,
  CheckCircle2,
  ArrowLeft,
  Shuffle,
  AlertTriangle,
  Layers,
} from 'lucide-react';

const COLORS = {
  departure: '#ef4444',
  arrival: '#3b82f6',
  circuit: '#a855f7',
  transit: '#94a3b8',
  vehicle: '#f59e0b',
};

const SCENARIO_5_STEPS = [
  {
    id: 1,
    time: '08:20:00',
    speaker: { role: 'INFO' },
    message:
      "Situation initiale. Piste 27 en service, vent 250°/10 kt, QNH 1020. Strips au tableau : FDVEN (TBM7, LFLB→LFVA via Penent, A/D 08:40) en approche depuis l'est. FGANC (DA42) au poste A2, prêt au départ vers LFPN via Saint-Amour. FBVXN (DR400) au poste C1, demande tour de piste. Deux strips vierges à remplir pour FGANC et FBVXN.",
    expectedResponse: null,
    teaching: null,
    aircraft: [
      { id: 'F-EN', type: 'arrival', x: 760, y: 132, label: 'F-EN', heading: 270 },
      { id: 'F-NC', type: 'departure', x: 350, y: 245, label: 'F-NC', heading: 0 },
      { id: 'F-XN', type: 'circuit', x: 405, y: 245, label: 'F-XN', heading: 0 },
    ],
  },
  {
    id: 2,
    time: '08:35:00',
    speaker: { role: 'PILOTE', callsign: 'F-EN', color: 'arrival' },
    message: 'AURIOL Tour, F-EN, demande approche directe piste 27',
    expectedResponse: 'F-EN, exécutez approche directe piste 27, rappelez longue finale',
    teaching:
      "F-EN (TBM7) arrive de l'est via Penent. Approche directe autorisée sur demande du pilote. On demande le rappel longue finale pour suivre sa progression. Strip bleu (arrivée).",
    aircraft: [
      { id: 'F-EN', type: 'arrival', x: 730, y: 132, label: 'F-EN', heading: 270 },
      { id: 'F-NC', type: 'departure', x: 350, y: 245, label: 'F-NC', heading: 0 },
      { id: 'F-XN', type: 'circuit', x: 405, y: 245, label: 'F-XN', heading: 0 },
    ],
  },
  {
    id: 3,
    time: '08:38:00',
    speaker: { role: 'PILOTE', callsign: 'F-NC', color: 'departure' },
    message: 'AURIOL Tower, FGANC, DA42, stand A2, to TOUSSUS-LE-NOBLE via Saint-Amour, request taxi',
    expectedResponse: "F-NC, runway 27 in use, wind 250°/10 kt, QNH 1020, taxi holding point runway 27",
    teaching:
      "Appel en anglais — on répond en anglais. Clairance de roulage standard : piste en service, vent, QNH, instruction. Strip rouge (départ). FGANC part vers LFPN via Saint-Amour (NE).",
    aircraft: [
      { id: 'F-EN', type: 'arrival', x: 700, y: 132, label: 'F-EN', heading: 270 },
      { id: 'F-NC', type: 'departure', x: 350, y: 245, label: 'F-NC', heading: 0 },
      { id: 'F-XN', type: 'circuit', x: 405, y: 245, label: 'F-XN', heading: 0 },
    ],
  },
  {
    id: 4,
    time: '08:39:00',
    speaker: { role: 'PILOTE', callsign: 'F-XN', color: 'circuit' },
    message: 'AURIOL Tour, FBVXN, DR400, poste C1, demande roulage pour un tour de piste',
    expectedResponse:
      "F-XN, piste 27 en service, vent 250°/10 kt, QNH 1020, laissez passer le DA42 du parking principal vers le point d'attente piste 27, puis roulez point d'attente piste 27",
    teaching:
      "F-NC (A2) et F-XN (C1) convergent vers le même point d'attente. F-NC ayant appelé en premier, il est prioritaire. « Laissez passer » prescrit l'ordre de roulage. Strip rouge+bleu (tour de piste).",
    aircraft: [
      { id: 'F-EN', type: 'arrival', x: 670, y: 132, label: 'F-EN', heading: 270 },
      { id: 'F-NC', type: 'departure', x: 360, y: 245, label: 'F-NC', heading: 0 },
      { id: 'F-XN', type: 'circuit', x: 405, y: 245, label: 'F-XN', heading: 0 },
    ],
  },
  {
    id: 5,
    time: '08:39:30',
    speaker: { role: 'PILOTE', callsign: 'F-EN', color: 'arrival' },
    message: 'F-EN, longue finale piste 27',
    expectedResponse: 'F-EN, piste 27 autorisé atterrissage, vent 250°/10 kt',
    teaching:
      "F-EN est en longue finale approche directe. Piste libre (F-NC et F-XN encore au sol). On autorise l'atterrissage et on redonne le vent. La piste est occupée dès la transmission de cette clairance.",
    aircraft: [
      { id: 'F-EN', type: 'arrival', x: 650, y: 132, label: 'F-EN', heading: 270 },
      { id: 'F-NC', type: 'departure', x: 360, y: 180, label: 'F-NC', heading: 90 },
      { id: 'F-XN', type: 'circuit', x: 430, y: 245, label: 'F-XN', heading: 0 },
    ],
  },
  {
    id: 6,
    time: '08:42:20',
    speaker: { role: 'INFO' },
    message:
      "F-EN a atterri et dépassé l'intersection H2. F-NC et F-XN ont atteint le point d'attente piste 27 (F-NC en premier, F-XN derrière). Trois appels arrivent simultanément.",
    expectedResponse: null,
    teaching: null,
    aircraft: [
      { id: 'F-EN', type: 'arrival', x: 320, y: 132, label: 'F-EN', heading: 270 },
      { id: 'F-NC', type: 'departure', x: 383, y: 158, label: 'F-NC', heading: 0 },
      { id: 'F-XN', type: 'circuit', x: 383, y: 174, label: 'F-XN', heading: 0 },
    ],
  },
  {
    id: 7,
    time: '08:42:30',
    speaker: { role: 'PILOTE', callsign: 'F-NC', color: 'departure' },
    message: 'F-NC, ready, request backtrack runway 27',
    expectedResponse: 'F-NC, backtrack runway 27, line up and wait',
    teaching:
      "F-NC demande un backtrack pour utiliser toute la piste. On autorise remontée + alignement + ATTENTE — pas encore de décollage car F-EN est encore sur la piste. Strip de F-NC placé sur la barrette piste.",
    aircraft: [
      { id: 'F-EN', type: 'arrival', x: 250, y: 132, label: 'F-EN', heading: 270 },
      { id: 'F-NC', type: 'departure', x: 383, y: 158, label: 'F-NC', heading: 0 },
      { id: 'F-XN', type: 'circuit', x: 383, y: 174, label: 'F-XN', heading: 0 },
    ],
  },
  {
    id: 8,
    time: '08:43:00',
    speaker: { role: 'PILOTE', callsign: 'F-EN', color: 'arrival' },
    message: 'F-EN, piste dégagée, demande roulage pour le parking',
    expectedResponse: 'F-EN, roulez poste A4',
    teaching:
      "F-EN a libéré la piste — on lui attribue le poste A4 (TBM700 au parking principal). Strip de F-EN passe sous la barrette (roulage).",
    aircraft: [
      { id: 'F-EN', type: 'arrival', x: 160, y: 180, label: 'F-EN', heading: 90 },
      { id: 'F-NC', type: 'departure', x: 615, y: 132, label: 'F-NC', heading: 270 },
      { id: 'F-XN', type: 'circuit', x: 383, y: 158, label: 'F-XN', heading: 0 },
    ],
  },
  {
    id: 9,
    time: '08:43:30',
    speaker: { role: 'PILOTE', callsign: 'F-NC', color: 'departure' },
    message: 'F-NC, ready',
    expectedResponse: 'F-NC, runway 27 cleared for takeoff, wind 250°/10 kt',
    teaching:
      "F-EN a libéré la piste. F-NC est aligné au seuil 27 après backtrack. Piste libre, aucun trafic en approche → clairance décollage. F-XN attend au point d'attente H2.",
    aircraft: [
      { id: 'F-EN', type: 'arrival', x: 210, y: 245, label: 'F-EN', heading: 0 },
      { id: 'F-NC', type: 'departure', x: 615, y: 132, label: 'F-NC', heading: 270 },
      { id: 'F-XN', type: 'circuit', x: 383, y: 158, label: 'F-XN', heading: 0 },
    ],
  },
  {
    id: 10,
    time: '08:44:00',
    speaker: { role: 'SECU', callsign: 'SÉCURITÉ', color: 'vehicle' },
    message: 'AURIOL Tour, SÉCURITÉ, demande à procéder du SSLIA au local technique',
    expectedResponse: "SÉCURITÉ, procédez point d'attente piste 27",
    teaching:
      "Piste 27 en service → « point d'attente piste 27 ». F-NC décolle en ce moment — piste occupée. F-XN va démarrer sa remontée une fois la piste libre. SÉCURITÉ doit attendre.",
    aircraft: [
      { id: 'F-NC', type: 'departure', x: 480, y: 132, label: 'F-NC', heading: 270 },
      { id: 'F-XN', type: 'circuit', x: 383, y: 158, label: 'F-XN', heading: 0 },
      { id: 'SECU', type: 'vehicle', x: 515, y: 215, label: 'SÉCU' },
    ],
  },
  {
    id: 11,
    time: '08:44:30',
    speaker: { role: 'PILOTE', callsign: 'F-VH', color: 'arrival' },
    message:
      'AURIOL Tour, FNMVH, Cessna 172, provenance RENNES via Julienas, aérodrome estimé dans 5 minutes, pour atterrissage',
    expectedResponse:
      'F-VH, piste 27 en service, vent 250°/10 kt, QNH 1020, entrez vent arrière main droite piste 27, trafic au départ vers vent arrière, DA42, rappelez vent arrière',
    teaching:
      "F-VH arrive de Julienas (Nord) → intégration directe en vent arrière main droite, pas de vertical tour. On informe du trafic (DA42 = F-NC en montée initiale). F-XN est en remontée sur la piste. Strip bleu (arrivée).",
    aircraft: [
      { id: 'F-NC', type: 'departure', x: 40, y: 110, label: 'F-NC', heading: 270 },
      { id: 'F-XN', type: 'circuit', x: 540, y: 132, label: 'F-XN', heading: 270 },
      { id: 'F-VH', type: 'arrival', x: 740, y: 55, label: 'F-VH', heading: 225 },
      { id: 'SECU', type: 'vehicle', x: 440, y: 180, label: 'SÉCU' },
    ],
  },
  {
    id: 12,
    time: '08:45:00',
    speaker: { role: 'PILOTE', callsign: 'F-XN', color: 'circuit' },
    message: 'F-XN, prêt',
    expectedResponse:
      'F-XN, trafic au départ vers vent arrière, DA42, et trafic de Julienas vers vent arrière, Cessna 172, piste 27 autorisé décollage, vent 250°/10 kt, rappelez vent arrière main droite piste 27',
    teaching:
      "F-NC (DA42) est en montée initiale vers vent arrière, et F-VH (C172 depuis Julienas) rejoint le vent arrière — deux trafics. On informe F-XN des deux avant la clairance. Ordre : infos trafic → autorisation → vent.",
    aircraft: [
      { id: 'F-NC', type: 'departure', x: 150, y: 100, label: 'F-NC', heading: 90 },
      { id: 'F-XN', type: 'circuit', x: 615, y: 132, label: 'F-XN', heading: 270 },
      { id: 'F-VH', type: 'arrival', x: 680, y: 70, label: 'F-VH', heading: 225 },
      { id: 'SECU', type: 'vehicle', x: 383, y: 158, label: 'SÉCU' },
    ],
  },
  {
    id: 13,
    time: '08:45:30',
    speaker: { role: 'SECU', callsign: 'SÉCURITÉ', color: 'vehicle' },
    message: 'SÉCURITÉ, demande traversée piste 27',
    expectedResponse: 'SÉCURITÉ, traversez piste 27',
    teaching:
      "F-XN vient de décoller et a dépassé l'extrémité de piste — piste libre. F-NC est en vent arrière. Pas de conflit : traversée autorisée.",
    aircraft: [
      { id: 'F-NC', type: 'departure', x: 40, y: 110, label: 'F-NC', heading: 270 },
      { id: 'F-XN', type: 'circuit', x: 180, y: 132, label: 'F-XN', heading: 270 },
      { id: 'F-VH', type: 'arrival', x: 600, y: 80, label: 'F-VH', heading: 225 },
      { id: 'SECU', type: 'vehicle', x: 383, y: 170, label: 'SÉCU' },
    ],
  },
  {
    id: 14,
    time: '08:46:00',
    speaker: { role: 'PILOTE', callsign: 'F-TZ', color: 'circuit' },
    message:
      'AURIOL Tower, FMATZ, Transall, from ORLEANS via Morgon, airfield estimated in 5 minutes, for a touch and go, then back to ORLEANS via Saint-Amour',
    expectedResponse:
      'F-TZ, runway 27 in use, wind 250°/10 kt, QNH 1020, join right hand downwind runway 27 via overhead tower, traffic in downwind DR400, arrival from Julienas Cessna 172, report overhead tower',
    teaching:
      "F-TZ arrive depuis Morgon (Sud) → vertical tour obligatoire. À l'intégration, informer F-TZ des trafics : F-XN (DR400) déjà en vent arrière, et F-VH (Cessna 172 de Julienas) qui rejoint le vent arrière. Le QNH est donné pour le réglage altimétrique. Pilote anglais — on répond en anglais.",
    aircraft: [
      { id: 'F-XN', type: 'circuit', x: 180, y: 100, label: 'F-XN', heading: 90 },
      { id: 'F-VH', type: 'arrival', x: 680, y: 55, label: 'F-VH', heading: 225 },
      { id: 'F-TZ', type: 'circuit', x: 370, y: 390, label: 'F-TZ', heading: 0 },
      { id: 'SECU', type: 'vehicle', x: 383, y: 95, label: 'SÉCU' },
    ],
  },
  {
    id: 15,
    time: '08:46:30',
    speaker: { role: 'PILOTE', callsign: 'F-XN', color: 'circuit' },
    message: 'F-XN, vent arrière main droite piste 27',
    expectedResponse:
      "F-XN, numéro 1, rappelez finale piste 27, trafic de Julienas vers vent arrière, Cessna 172",
    teaching:
      "F-XN est seul dans le circuit (F-TZ est encore en route). F-VH (Cessna 172 de Julienas) arrive vers le vent arrière — information de trafic donnée à F-XN. Numéro 1, rappel en finale.",
    aircraft: [
      { id: 'F-XN', type: 'circuit', x: 260, y: 100, label: 'F-XN', heading: 90 },
      { id: 'F-VH', type: 'arrival', x: 560, y: 55, label: 'F-VH', heading: 225 },
      { id: 'F-TZ', type: 'circuit', x: 370, y: 320, label: 'F-TZ', heading: 0 },
    ],
    showPattern: true,
  },
  {
    id: 16,
    time: '08:47:00',
    speaker: { role: 'PILOTE', callsign: 'F-TZ', color: 'circuit' },
    message: 'F-TZ, overhead tower',
    expectedResponse:
      'F-TZ, traffic in downwind DR400, traffic from Julienas joining downwind, Cessna 172, report downwind',
    teaching:
      "F-TZ passe le vertical tour. On l'informe de F-XN (DR400, déjà en vent arrière devant lui — le plus important) et de F-VH (Cessna 172 de Julienas, qui intègre le vent arrière). F-NC (DA42 au départ) est encore sur fréquence mais n'affecte pas le circuit. Rappel vent arrière.",
    aircraft: [
      { id: 'F-XN', type: 'circuit', x: 350, y: 100, label: 'F-XN', heading: 90 },
      { id: 'F-VH', type: 'arrival', x: 200, y: 100, label: 'F-VH', heading: 90 },
      { id: 'F-TZ', type: 'circuit', x: 370, y: 260, label: 'F-TZ', heading: 0 },
    ],
    showPattern: true,
  },
  {
    id: 17,
    time: '08:47:30',
    speaker: { role: 'PILOTE', callsign: 'F-VH', color: 'arrival' },
    message: 'F-VH, vent arrière main droite piste 27',
    expectedResponse: 'F-VH, numéro 2, suivez un DR400 en vent arrière, rappelez finale',
    teaching:
      "F-VH intègre le vent arrière derrière F-XN (DR400, n°1). Séquencement : n°2, suivre le DR400 visuellement. Rappel en finale (car F-VH sera le prochain à atterrir).",
    aircraft: [
      { id: 'F-XN', type: 'circuit', x: 430, y: 100, label: 'F-XN', heading: 90 },
      { id: 'F-VH', type: 'arrival', x: 270, y: 100, label: 'F-VH', heading: 90 },
      { id: 'F-TZ', type: 'circuit', x: 155, y: 100, label: 'F-TZ', heading: 90 },
    ],
    showPattern: true,
  },
  {
    id: 18,
    time: '08:48:00',
    speaker: { role: 'PILOTE', callsign: 'F-NC', color: 'departure' },
    message: 'F-NC, leaving frequency, goodbye',
    expectedResponse: 'F-NC, roger, goodbye',
    teaching:
      "F-NC quitte la fréquence pour rejoindre Toussus-le-Noble. On accuse réception sobrement. On note l'heure de dernier contact sur le strip puis on l'archive.",
    aircraft: [
      { id: 'F-XN', type: 'circuit', x: 490, y: 100, label: 'F-XN', heading: 90 },
      { id: 'F-VH', type: 'arrival', x: 330, y: 100, label: 'F-VH', heading: 90 },
      { id: 'F-TZ', type: 'circuit', x: 175, y: 100, label: 'F-TZ', heading: 90 },
    ],
    showPattern: true,
  },
  {
    id: 19,
    time: '08:49:00',
    speaker: { role: 'PILOTE', callsign: 'F-VH', color: 'arrival' },
    message: 'F-VH, finale piste 27',
    expectedResponse: 'F-VH, numéro 1, DR400 sur la piste, rappelez courte finale',
    teaching:
      "F-XN (DR400) vient d'atterrir et effectue son toucher-roulé-décollage — il est encore sur la piste. Piste occupée : on ne peut pas autoriser l'atterrissage. On donne le numéro d'ordre (n°1) et on informe F-VH du DR400 sur la piste. Le rappel courte finale permet de réévaluer la situation juste avant.",
    aircraft: [
      { id: 'F-XN', type: 'circuit', x: 350, y: 132, label: 'F-XN', heading: 270 },
      { id: 'F-VH', type: 'arrival', x: 605, y: 132, label: 'F-VH', heading: 270 },
      { id: 'F-TZ', type: 'circuit', x: 290, y: 100, label: 'F-TZ', heading: 90 },
    ],
  },
  {
    id: 20,
    time: '08:49:30',
    speaker: { role: 'PILOTE', callsign: 'F-EP', color: 'departure' },
    message: 'AURIOL Tour, FBVEP, Beech 200, poste B2, destination COLMAR via Nord-Est, demande roulage',
    expectedResponse: "F-EP, piste 27 en service, vent 250°/10 kt, QNH 1020, roulez point d'attente piste 27",
    teaching:
      "F-EP (BE20) est au poste B2 — pas de conflit de roulage avec d'autres aéronefs au sol. Clairance de roulage standard. Strip rouge (départ).",
    aircraft: [
      { id: 'F-XN', type: 'circuit', x: 280, y: 132, label: 'F-XN', heading: 270 },
      { id: 'F-VH', type: 'arrival', x: 605, y: 132, label: 'F-VH', heading: 270 },
      { id: 'F-TZ', type: 'circuit', x: 350, y: 100, label: 'F-TZ', heading: 90 },
      { id: 'F-EP', type: 'departure', x: 320, y: 245, label: 'F-EP', heading: 0 },
    ],
  },
  {
    id: 21,
    time: '08:50:00',
    speaker: { role: 'INFO' },
    message:
      "F-XN (DR400) a effectué son toucher et redécolle. La piste restera occupée jusqu'à ce que F-XN franchisse l'extrémité — notez l'heure précise (08:50:05) pour un éventuel délai de turbulence de sillage. F-TZ (Transall, catégorie M) est maintenant en vent arrière.",
    expectedResponse: null,
    teaching: null,
    aircraft: [
      { id: 'F-XN', type: 'circuit', x: 130, y: 132, label: 'F-XN', heading: 270 },
      { id: 'F-VH', type: 'arrival', x: 605, y: 132, label: 'F-VH', heading: 270 },
      { id: 'F-TZ', type: 'circuit', x: 420, y: 100, label: 'F-TZ', heading: 90 },
      { id: 'F-EP', type: 'departure', x: 440, y: 180, label: 'F-EP', heading: 90 },
    ],
    showPattern: true,
  },
  {
    id: 22,
    time: '08:50:30',
    speaker: { role: 'PILOTE', callsign: 'F-TZ', color: 'circuit' },
    message: 'F-TZ, right hand downwind runway 27',
    expectedResponse: 'F-TZ, number 2, follow a Cessna 172 on short final, report final',
    teaching:
      "F-TZ (Transall) entre en vent arrière. F-VH (Cessna 172) est en courte finale. On séquence F-TZ en n°2 derrière F-VH et on demande le rappel finale. Attention : F-XN est encore sur la piste — la situation va évoluer.",
    aircraft: [
      { id: 'F-XN', type: 'circuit', x: 95, y: 132, label: 'F-XN', heading: 270 },
      { id: 'F-VH', type: 'arrival', x: 605, y: 132, label: 'F-VH', heading: 270 },
      { id: 'F-TZ', type: 'circuit', x: 460, y: 100, label: 'F-TZ', heading: 90 },
      { id: 'F-EP', type: 'departure', x: 383, y: 158, label: 'F-EP', heading: 0 },
    ],
    showPattern: true,
  },
  {
    id: 23,
    time: '08:50:45',
    speaker: { role: 'PILOTE', callsign: 'F-VH', color: 'arrival' },
    message: 'F-VH, courte finale',
    expectedResponse: 'F-VH, remettez les gaz, rappelez vent arrière piste 27',
    teaching:
      "F-XN n'a pas encore franchi l'extrémité de piste — piste toujours occupée. On commande la remise de gaz. F-VH perd son numéro d'ordre au passage du seuil de piste. L'heure de remise de gaz est notée avec une flèche sur le strip. F-TZ devient de facto n°1.",
    aircraft: [
      { id: 'F-XN', type: 'circuit', x: 80, y: 105, label: 'F-XN', heading: 315 },
      { id: 'F-VH', type: 'arrival', x: 605, y: 132, label: 'F-VH', heading: 270 },
      { id: 'F-TZ', type: 'circuit', x: 490, y: 100, label: 'F-TZ', heading: 90 },
      { id: 'F-EP', type: 'departure', x: 383, y: 158, label: 'F-EP', heading: 0 },
    ],
  },
  {
    id: 24,
    time: '08:51:30',
    speaker: { role: 'PILOTE', callsign: 'F-ML', color: 'transit' },
    message:
      'AURIOL Tower, FGHML, Tobago, transit from DIJON to NICE via North, 3000 ft QNH, over airfield estimated in 5 minutes, exit via Fleurie',
    expectedResponse: 'F-ML, runway 27 in use, QNH 1020, traffic in circuit Transall and Cessna 172, report overhead airfield',
    teaching:
      "Transit VFR : on donne la piste en service, le QNH, et les trafics en circuit pour la conscience de situation — même si F-ML est à 3000 ft QNH et le circuit à 1400 ft (pas de conflit d'altitude). On informe : F-TZ (Transall) et F-VH (Cessna 172) en vent arrière. Rappel vertical aérodrome.",
    aircraft: [
      { id: 'F-VH', type: 'arrival', x: 200, y: 100, label: 'F-VH', heading: 90 },
      { id: 'F-TZ', type: 'circuit', x: 550, y: 100, label: 'F-TZ', heading: 90 },
      { id: 'F-EP', type: 'departure', x: 383, y: 158, label: 'F-EP', heading: 0 },
      { id: 'F-ML', type: 'transit', x: 370, y: 35, label: 'F-ML', heading: 180 },
    ],
    showPattern: true,
  },
  {
    id: 25,
    time: '08:52:00',
    speaker: { role: 'PILOTE', callsign: 'F-XN', color: 'circuit' },
    message: 'F-XN, je quitte la fréquence, au parking',
    expectedResponse: 'F-XN, roger, au revoir',
    teaching:
      "F-XN a complété son tour de piste et roule vers le parking. On accuse réception, on note l'heure de dernier contact, on archive le strip.",
    aircraft: [
      { id: 'F-VH', type: 'arrival', x: 175, y: 100, label: 'F-VH', heading: 90 },
      { id: 'F-TZ', type: 'circuit', x: 570, y: 100, label: 'F-TZ', heading: 90 },
      { id: 'F-EP', type: 'departure', x: 383, y: 158, label: 'F-EP', heading: 0 },
      { id: 'F-ML', type: 'transit', x: 370, y: 155, label: 'F-ML', heading: 180 },
    ],
    showPattern: true,
  },
  {
    id: 26,
    time: '08:52:30',
    speaker: { role: 'PILOTE', callsign: 'F-YH', color: 'arrival' },
    message:
      'AURIOL Tour, FBXYH, Cessna 172, provenance RODEZ via le Sud-Ouest, aérodrome estimé dans 5 minutes, pour atterrissage',
    expectedResponse:
      'F-YH, piste 27 en service, vent 250°/10 kt, QNH 1020, entrez vent arrière main droite piste 27 via vertical tour, trafic en tour de piste Transall et Cessna 172, trafic du Nord vers vertical Tobago, rappelez vertical tour',
    teaching:
      "F-YH arrive du Sud-Ouest → vertical tour obligatoire. Informer F-YH de tous les trafics : F-TZ (Transall) et F-VH (Cessna 172) en vent arrière, et F-ML (Tobago) qui converge vers le vertical depuis le Nord. Réciprocité : informer F-ML en anglais « F-ML, traffic from the South-West joining overhead, Cessna 172 », et informer F-VH et F-TZ : « F-VH / F-TZ, trafic du Sud-Ouest vers vertical, Cessna 172 ».",
    aircraft: [
      { id: 'F-VH', type: 'arrival', x: 200, y: 100, label: 'F-VH', heading: 90 },
      { id: 'F-TZ', type: 'circuit', x: 570, y: 100, label: 'F-TZ', heading: 90 },
      { id: 'F-EP', type: 'departure', x: 383, y: 158, label: 'F-EP', heading: 0 },
      { id: 'F-ML', type: 'transit', x: 370, y: 185, label: 'F-ML', heading: 180 },
      { id: 'F-YH', type: 'arrival', x: 70, y: 375, label: 'F-YH', heading: 45 },
    ],
  },
  {
    id: 27,
    time: '08:52:50',
    speaker: { role: 'PILOTE', callsign: 'F-VH', color: 'arrival' },
    message: 'F-VH, vent arrière main droite piste 27',
    expectedResponse: 'F-VH, numéro 2, suivez un Transall en finale, rappelez finale',
    teaching:
      "F-VH a effectué sa remise de gaz et a rejoint le vent arrière. F-TZ (Transall) est en finale. On séquence F-VH en n°2 derrière le Transall. Le transit F-ML (3000 ft) ne conflifte pas avec le circuit (1400 ft).",
    aircraft: [
      { id: 'F-VH', type: 'arrival', x: 280, y: 100, label: 'F-VH', heading: 90 },
      { id: 'F-TZ', type: 'circuit', x: 605, y: 132, label: 'F-TZ', heading: 270 },
      { id: 'F-EP', type: 'departure', x: 383, y: 158, label: 'F-EP', heading: 0 },
      { id: 'F-ML', type: 'transit', x: 370, y: 235, label: 'F-ML', heading: 180 },
      { id: 'F-YH', type: 'arrival', x: 160, y: 355, label: 'F-YH', heading: 45 },
    ],
    showPattern: true,
  },
  {
    id: 28,
    time: '08:53:00',
    speaker: { role: 'PILOTE', callsign: 'F-ML', color: 'transit' },
    message: 'F-ML, overhead airfield',
    expectedResponse: 'F-ML, report Fleurie',
    teaching:
      "F-ML passe le vertical aérodrome à 3000 ft. On lui demande de rappeler en passant à Fleurie (son prochain point VFR sur la route vers Nice). Ce report marque la fin de sa traversée de la zone.",
    aircraft: [
      { id: 'F-VH', type: 'arrival', x: 320, y: 100, label: 'F-VH', heading: 90 },
      { id: 'F-TZ', type: 'circuit', x: 605, y: 132, label: 'F-TZ', heading: 270 },
      { id: 'F-EP', type: 'departure', x: 383, y: 158, label: 'F-EP', heading: 0 },
      { id: 'F-ML', type: 'transit', x: 370, y: 260, label: 'F-ML', heading: 180 },
      { id: 'F-YH', type: 'arrival', x: 260, y: 305, label: 'F-YH', heading: 45 },
    ],
  },
  {
    id: 29,
    time: '08:53:30',
    speaker: { role: 'PILOTE', callsign: 'F-TZ', color: 'circuit' },
    message: 'F-TZ, final runway 27 for a touch and go',
    expectedResponse: 'F-TZ, runway 27 cleared touch and go, wind 250°/10 kt',
    teaching:
      "Piste libre. On autorise le toucher du Transall. On note précisément l'heure du lever des roues (hh:mm:ss) en anticipation d'un possible délai de turbulence de sillage : F-VH (C172, cat. L) suit F-TZ (Transall, cat. M) → délai minimum 2 minutes si F-VH décolle après F-TZ. Pour l'atterrissage, vérifier que la piste est dégagée de la turbulence.",
    aircraft: [
      { id: 'F-VH', type: 'arrival', x: 380, y: 100, label: 'F-VH', heading: 90 },
      { id: 'F-TZ', type: 'circuit', x: 605, y: 132, label: 'F-TZ', heading: 270 },
      { id: 'F-EP', type: 'departure', x: 383, y: 158, label: 'F-EP', heading: 0 },
      { id: 'F-YH', type: 'arrival', x: 350, y: 270, label: 'F-YH', heading: 0 },
    ],
  },
  {
    id: 30,
    time: '08:54:00',
    speaker: { role: 'PILOTE', callsign: 'F-ML', color: 'transit' },
    message: 'F-ML, Fleurie, leaving frequency',
    expectedResponse: 'F-ML, roger, goodbye',
    teaching:
      "F-ML passe Fleurie et quitte la fréquence pour contacter l'organisme suivant. Accusé de réception, heure de dernier contact notée, strip archivé.",
    aircraft: [
      { id: 'F-VH', type: 'arrival', x: 430, y: 100, label: 'F-VH', heading: 90 },
      { id: 'F-TZ', type: 'circuit', x: 300, y: 132, label: 'F-TZ', heading: 270 },
      { id: 'F-EP', type: 'departure', x: 383, y: 158, label: 'F-EP', heading: 0 },
      { id: 'F-YH', type: 'arrival', x: 370, y: 260, label: 'F-YH', heading: 0 },
    ],
  },
  {
    id: 31,
    time: '08:54:20',
    speaker: { role: 'PILOTE', callsign: 'F-YH', color: 'arrival' },
    message: 'F-YH, vertical tour',
    expectedResponse: 'F-YH, rappelez vent arrière',
    teaching:
      "F-YH passe le vertical tour après son arrivée par le Sud-Ouest. Il va rejoindre le vent arrière main droite piste 27. On demande simplement le rappel vent arrière — il sera séquencé derrière F-VH.",
    aircraft: [
      { id: 'F-VH', type: 'arrival', x: 460, y: 100, label: 'F-VH', heading: 90 },
      { id: 'F-TZ', type: 'circuit', x: 175, y: 132, label: 'F-TZ', heading: 270 },
      { id: 'F-EP', type: 'departure', x: 383, y: 158, label: 'F-EP', heading: 0 },
      { id: 'F-YH', type: 'arrival', x: 370, y: 260, label: 'F-YH', heading: 0 },
    ],
    showPattern: true,
  },
  {
    id: 32,
    time: '08:55:00',
    speaker: { role: 'PILOTE', callsign: 'F-VH', color: 'arrival' },
    message: 'F-VH, finale piste 27',
    expectedResponse: 'F-VH, piste 27 autorisé atterrissage, vent 250°/10 kt',
    teaching:
      "F-TZ (Transall, cat. M) a touché et redécollé vers le Nord. F-VH (C172, cat. L) atterrit sur la piste 27 — les trajectoires divergent (Transall part au Nord, C172 atterrit à l'Ouest). Pas de problème de turbulence de sillage sur l'axe d'atterrissage. Piste libre : atterrissage autorisé.",
    aircraft: [
      { id: 'F-VH', type: 'arrival', x: 605, y: 132, label: 'F-VH', heading: 270 },
      { id: 'F-TZ', type: 'circuit', x: 130, y: 85, label: 'F-TZ', heading: 45 },
      { id: 'F-EP', type: 'departure', x: 383, y: 158, label: 'F-EP', heading: 0 },
      { id: 'F-YH', type: 'arrival', x: 175, y: 100, label: 'F-YH', heading: 90 },
    ],
  },
  {
    id: 33,
    time: '08:55:30',
    speaker: { role: 'PILOTE', callsign: 'F-TZ', color: 'circuit' },
    message: 'F-TZ, leaving frequency, back to Orléans via Saint-Amour',
    expectedResponse: 'F-TZ, roger, goodbye',
    teaching:
      "F-TZ a accompli son toucher-roulé-décollage et quitte la fréquence pour rentrer à Orléans via Saint-Amour (NE). Strip archivé avec heure de dernier contact.",
    aircraft: [
      { id: 'F-VH', type: 'arrival', x: 340, y: 178, label: 'F-VH', heading: 270 },
      { id: 'F-EP', type: 'departure', x: 383, y: 158, label: 'F-EP', heading: 0 },
      { id: 'F-YH', type: 'arrival', x: 280, y: 100, label: 'F-YH', heading: 90 },
    ],
  },
  {
    id: 34,
    time: '08:56:00',
    speaker: { role: 'PILOTE', callsign: 'F-VH', color: 'arrival' },
    message: 'F-VH, piste dégagée, demande roulage',
    expectedResponse: 'F-VH, roulez poste D1',
    teaching:
      "F-VH libère la piste. On lui attribue le poste D1 (parking aéroclub). Note Livret 2 : le parking D n'est pas visible depuis la tour — si le pilote avait demandé lui-même « parking D », on n'aurait pas à lui désigner de poste spécifique.",
    aircraft: [
      { id: 'F-VH', type: 'arrival', x: 250, y: 178, label: 'F-VH', heading: 270 },
      { id: 'F-EP', type: 'departure', x: 383, y: 158, label: 'F-EP', heading: 0 },
      { id: 'F-YH', type: 'arrival', x: 380, y: 100, label: 'F-YH', heading: 90 },
    ],
    showPattern: true,
  },
  {
    id: 35,
    time: '08:57:00',
    speaker: { role: 'PILOTE', callsign: 'F-EP', color: 'departure' },
    message: 'F-EP, prêt, demande remontée piste 27',
    expectedResponse: "F-EP, maintenez avant point d'attente piste 27, Cessna 172 en vent arrière",
    teaching:
      "Verrou de piste piste 27 pour une remontée : la piste est verrouillée dès que l'arrivée passe le travers tour en vent arrière. F-YH est en vent arrière et a dépassé le travers tour → on maintient F-EP au point d'attente avec l'info trafic.",
    aircraft: [
      { id: 'F-EP', type: 'departure', x: 383, y: 158, label: 'F-EP', heading: 0 },
      { id: 'F-YH', type: 'arrival', x: 430, y: 100, label: 'F-YH', heading: 90 },
    ],
    showPattern: true,
  },
  {
    id: 36,
    time: '08:57:30',
    speaker: { role: 'PILOTE', callsign: 'F-YH', color: 'arrival' },
    message: 'F-YH, vent arrière main droite piste 27',
    expectedResponse: 'F-YH, numéro 1, rappelez finale piste 27',
    teaching:
      "F-YH est seul dans le circuit. Numéro 1, rappel en finale. F-EP reste au point d'attente — le verrou reste actif tant que F-YH n'a pas dégagé la piste.",
    aircraft: [
      { id: 'F-EP', type: 'departure', x: 383, y: 158, label: 'F-EP', heading: 0 },
      { id: 'F-YH', type: 'arrival', x: 480, y: 100, label: 'F-YH', heading: 90 },
    ],
    showPattern: true,
  },
  {
    id: 37,
    time: '08:58:30',
    speaker: { role: 'PILOTE', callsign: 'F-YH', color: 'arrival' },
    message: 'F-YH, finale piste 27',
    expectedResponse: 'F-YH, piste 27 autorisé atterrissage, vent 250°/10 kt',
    teaching:
      "F-YH est en finale. Piste libre. Atterrissage autorisé. F-EP reste maintenu — on attend que F-YH atterrisse et dégage la piste avant d'autoriser la remontée.",
    aircraft: [
      { id: 'F-EP', type: 'departure', x: 383, y: 158, label: 'F-EP', heading: 0 },
      { id: 'F-YH', type: 'arrival', x: 605, y: 132, label: 'F-YH', heading: 270 },
    ],
  },
  {
    id: 38,
    time: '08:59:30',
    speaker: { role: 'PILOTE', callsign: 'F-YH', color: 'arrival' },
    message: 'F-YH, piste dégagée, demande roulage',
    expectedResponse: 'F-YH, roulez poste C3',
    teaching:
      "F-YH a libéré la piste — poste C3 attribué (C172 au parking principal). La piste est maintenant disponible pour F-EP. On peut enchaîner immédiatement avec la clairance de remontée.",
    aircraft: [
      { id: 'F-EP', type: 'departure', x: 383, y: 158, label: 'F-EP', heading: 0 },
      { id: 'F-YH', type: 'arrival', x: 280, y: 178, label: 'F-YH', heading: 270 },
    ],
  },
  {
    id: 39,
    time: '09:00:00',
    speaker: { role: 'PILOTE', callsign: 'F-EP', color: 'departure' },
    message: 'F-EP, prêt',
    expectedResponse: 'F-EP, remontez piste 27, alignez-vous, piste 27 autorisé décollage, vent 250°/10 kt',
    teaching:
      "Piste libre, aucun trafic en approche. Quand le trafic le permet et qu'aucun conflit n'est prévisible, on peut combiner remontée + alignement + décollage en une seule clairance. F-EP (BE20) partira vers COLMAR via Nord-Est. Scénario terminé — 40 minutes de simulation de 08:20 à 09:00.",
    aircraft: [
      { id: 'F-EP', type: 'departure', x: 615, y: 132, label: 'F-EP', heading: 270 },
      { id: 'F-YH', type: 'arrival', x: 350, y: 245, label: 'F-YH', heading: 0 },
    ],
  },
];

const SCENARIOS = [
  {
    id: 'scenario_5',
    title: 'Matinée chargée — 40 min',
    description:
      "Scénario long combinant approche directe, laissez-passer, backtrack, remise de gaz, tour de piste, transit et verrou de piste. Pilotes anglais et français.",
    color: '#8b5cf6',
    icon: 'layers',
    setup: { wind: '250°/10 kt', qnh: '1020', rwy: '27' },
    steps: SCENARIO_5_STEPS,
  },
];

function AirportMap({ aircraft = [], showPattern = false, showSaintAmour = false }) {
  return (
    <svg viewBox="0 0 800 420" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
      <g>
        <circle cx="45" cy="40" r="18" fill="none" stroke="#475569" strokeWidth="0.5" />
        <text x="45" y="28" textAnchor="middle" fontSize="11" fill="#cbd5e1" fontWeight="500">N</text>
        <line x1="45" y1="55" x2="45" y2="30" stroke="#cbd5e1" strokeWidth="1.2" />
      </g>

      {showSaintAmour && (
        <g>
          <text x="770" y="45" textAnchor="end" fontSize="10" fill="#64748b">Saint-Amour / Julienas (NE)</text>
          <line x1="740" y1="51" x2="680" y2="80" stroke="#64748b" strokeWidth="0.4" strokeDasharray="2 2" />
        </g>
      )}

      {showPattern && (
        <g>
          <rect x="130" y="78" width="420" height="46" fill="none" stroke="#a78bfa" strokeWidth="0.7" strokeDasharray="5 4" />
          <text x="340" y="72" textAnchor="middle" fontSize="9" fill="#a78bfa">vent arrière main droite piste 27</text>
          <path d="M 220 101 L 280 101" stroke="#a78bfa" strokeWidth="0.8" fill="none" />
          <polygon points="278,98 286,101 278,104" fill="#a78bfa" />
        </g>
      )}

      <rect x="80" y="120" width="540" height="22" fill="#475569" stroke="#1e293b" strokeWidth="0.5" />
      <text x="70" y="135" textAnchor="end" fontSize="11" fill="#e2e8f0" fontWeight="600">09</text>
      <text x="630" y="135" textAnchor="start" fontSize="11" fill="#e2e8f0" fontWeight="600">27</text>
      {[92, 98, 104].map((x) => (
        <line key={'l' + x} x1={x} y1="122" x2={x} y2="140" stroke="#cbd5e1" strokeWidth="0.5" />
      ))}
      {[596, 602, 608].map((x) => (
        <line key={'r' + x} x1={x} y1="122" x2={x} y2="140" stroke="#cbd5e1" strokeWidth="0.5" />
      ))}

      <rect x="380" y="142" width="6" height="38" fill="#334155" />
      <line x1="374" y1="148" x2="392" y2="148" stroke="#ef4444" strokeWidth="1.5" />
      <text x="397" y="158" textAnchor="start" fontSize="8" fill="#94a3b8">H2</text>

      <rect x="107" y="142" width="13" height="58" fill="#334155" />
      <text x="95" y="165" textAnchor="end" fontSize="8" fill="#94a3b8">W1</text>

      <rect x="107" y="178" width="443" height="4" fill="#334155" />

      <rect x="197" y="182" width="12" height="18" fill="#334155" />
      <rect x="360" y="182" width="12" height="18" fill="#334155" />

      <rect x="280" y="200" width="180" height="48" fill="#1e293b" stroke="#475569" strokeWidth="0.4" rx="3" />
      <text x="370" y="217" textAnchor="middle" fontSize="9" fill="#94a3b8">Parking principal</text>
      <text x="300" y="238" textAnchor="middle" fontSize="8" fill="#64748b">A2</text>
      <text x="340" y="238" textAnchor="middle" fontSize="8" fill="#64748b">B1</text>
      <text x="380" y="238" textAnchor="middle" fontSize="8" fill="#64748b">C1</text>

      <rect x="180" y="200" width="60" height="48" fill="#1e293b" stroke="#475569" strokeWidth="0.4" rx="3" />
      <text x="210" y="217" textAnchor="middle" fontSize="9" fill="#94a3b8">Aéroclub D</text>
      <text x="210" y="236" textAnchor="middle" fontSize="8" fill="#64748b">D1 D2</text>

      <rect x="490" y="200" width="50" height="28" fill="#7c2d12" fillOpacity="0.35" stroke="#d97706" strokeWidth="0.5" rx="2" />
      <text x="515" y="218" textAnchor="middle" fontSize="8" fill="#fcd34d">SSLIA</text>

      <circle cx="370" cy="265" r="4" fill="#475569" />
      <text x="382" y="269" textAnchor="start" fontSize="8" fill="#94a3b8">TWR</text>

      <rect x="374" y="85" width="50" height="22" fill="#1e293b" stroke="#475569" strokeWidth="0.4" rx="2" />
      <text x="399" y="100" textAnchor="middle" fontSize="8" fill="#94a3b8">Local tech.</text>

      {aircraft.map((ac) => (
        <g
          key={ac.id}
          style={{ transition: 'transform 1500ms cubic-bezier(0.4, 0, 0.2, 1)' }}
          transform={'translate(' + ac.x + ', ' + ac.y + ')'}
        >
          {ac.type === 'vehicle' ? (
            <rect x="-7" y="-5" width="14" height="10" fill={COLORS.vehicle} stroke="#92400e" strokeWidth="0.5" rx="1" />
          ) : (
            <polygon
              points="0,-9 6,6 0,3 -6,6"
              fill={COLORS[ac.type]}
              stroke="#0f172a"
              strokeWidth="0.6"
              transform={'rotate(' + (ac.heading || 0) + ')'}
            />
          )}
          <text x="0" y="-14" textAnchor="middle" fontSize="10" fill={COLORS[ac.type]} fontWeight="600">
            {ac.label}
          </text>
        </g>
      ))}
    </svg>
  );
}

function getIconForScenario(iconName) {
  switch (iconName) {
    case 'plane':
      return Plane;
    case 'shuffle':
      return Shuffle;
    case 'truck':
      return Truck;
    case 'alert':
      return AlertTriangle;
    default:
      return Layers;
  }
}

function ScenarioMenu({ onSelect }) {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="space-y-2">
          <div className="flex items-center gap-3">
            <Radio className="w-7 h-7 text-amber-400" />
            <h1 className="text-2xl font-semibold tracking-wide">AURIOL TWR · Simulateur</h1>
          </div>
          <p className="text-sm text-slate-400">
            Choisis un scénario. Chacun te présente une situation extraite des livrets BASIC TWR avec carte interactive,
            corrections et notes pédagogiques.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {SCENARIOS.map((scenario, idx) => {
            const Icon = getIconForScenario(scenario.icon);
            return (
              <button
                key={scenario.id}
                onClick={() => onSelect(idx)}
                className="text-left bg-slate-800 border border-slate-700 rounded-lg p-5 hover:border-amber-400/40 hover:bg-slate-800/80 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div
                    className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center border"
                    style={{ backgroundColor: scenario.color + '20', borderColor: scenario.color + '60' }}
                  >
                    <Icon className="w-5 h-5" style={{ color: scenario.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <h2 className="font-semibold text-slate-100 truncate">{scenario.title}</h2>
                      <span
                        className="text-xs px-2 py-0.5 rounded font-medium flex-shrink-0"
                        style={{ backgroundColor: scenario.color + '20', color: scenario.color }}
                      >
                        Scénario {idx + 1}/{SCENARIOS.length}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed mb-3">{scenario.description}</p>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-mono text-slate-500">
                      <span>RWY {scenario.setup.rwy}</span>
                      <span>{scenario.setup.wind}</span>
                      <span>QNH {scenario.setup.qnh}</span>
                      <span className="ml-auto">{scenario.steps.length} étapes</span>
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <div className="text-xs text-slate-500 text-center pt-4 border-t border-slate-800">
          Simulateur d'entraînement BASIC TWR — basé sur les livrets ENAC. Aérodrome fictif d'AURIOL (LFVA), fréquence
          119.000 MHz.
        </div>
      </div>
    </div>
  );
}

export default function ATCSimulator() {
  const [selectedScenarioIndex, setSelectedScenarioIndex] = useState(null);
  const [step, setStep] = useState(0);
  const [userResponse, setUserResponse] = useState('');
  const [revealed, setRevealed] = useState(false);

  if (selectedScenarioIndex === null) {
    return (
      <ScenarioMenu
        onSelect={(idx) => {
          setSelectedScenarioIndex(idx);
          setStep(0);
          setUserResponse('');
          setRevealed(false);
        }}
      />
    );
  }

  const scenario = SCENARIOS[selectedScenarioIndex];
  const steps = scenario.steps;
  const current = steps[step];
  const isLast = step === steps.length - 1;
  const needsResponse = current.expectedResponse !== null;

  const handleReveal = () => setRevealed(true);
  const handleNext = () => {
    if (!isLast) {
      setStep(step + 1);
      setUserResponse('');
      setRevealed(false);
    }
  };
  const handleReset = () => {
    setStep(0);
    setUserResponse('');
    setRevealed(false);
  };
  const handleBackToMenu = () => {
    setSelectedScenarioIndex(null);
    setStep(0);
    setUserResponse('');
    setRevealed(false);
  };

  const speakerIsSecu = current.speaker.role === 'SECU';

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-4 md:p-6">
      <div className="max-w-5xl mx-auto space-y-4">
        <header className="flex flex-wrap items-center justify-between gap-3 p-4 bg-slate-800 rounded-lg border border-slate-700">
          <div className="flex items-center gap-2.5">
            <button
              onClick={handleBackToMenu}
              className="text-slate-400 hover:text-slate-200 transition-colors p-1 -ml-1"
              aria-label="Retour au menu"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <Radio className="w-5 h-5 text-amber-400" />
            <div>
              <h1 className="text-base font-semibold tracking-wide">AURIOL TWR</h1>
              <p className="text-xs text-slate-400">{scenario.title}</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              <span className="font-mono text-amber-300">{current.time}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Wind className="w-3.5 h-3.5 text-slate-500" />
              <span className="font-mono">{scenario.setup.wind}</span>
            </div>
            <div className="font-mono">
              <span className="text-slate-500">RWY </span>
              <span className="text-amber-300 font-semibold">{scenario.setup.rwy}</span>
            </div>
            <div className="font-mono">
              <span className="text-slate-500">QNH </span>
              <span className="text-amber-300 font-semibold">{scenario.setup.qnh}</span>
            </div>
          </div>
        </header>

        <div className="bg-slate-800/50 rounded-lg border border-slate-700 p-4">
          <AirportMap
            aircraft={current.aircraft}
            showPattern={current.showPattern}
            showSaintAmour={current.showSaintAmour}
          />
        </div>

        <div className="flex items-center gap-3 text-xs">
          <span className="text-slate-500 font-mono">
            {String(step + 1).padStart(2, '0')} / {String(steps.length).padStart(2, '0')}
          </span>
          <div className="flex-1 h-1 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-amber-400 transition-all duration-700 ease-out"
              style={{ width: ((step + 1) / steps.length) * 100 + '%' }}
            />
          </div>
        </div>

        <div className="space-y-3">
          {current.speaker.role === 'INFO' ? (
            <div className="flex items-start gap-3 bg-slate-800/40 border border-slate-700 border-dashed rounded-lg p-3.5">
              <Info className="w-5 h-5 text-slate-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-slate-300 leading-relaxed">{current.message}</p>
            </div>
          ) : (
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center bg-slate-800 border border-slate-700">
                {speakerIsSecu ? (
                  <Truck className="w-5 h-5" style={{ color: COLORS.vehicle }} />
                ) : (
                  <Plane className="w-5 h-5" style={{ color: COLORS[current.speaker.color] }} />
                )}
              </div>
              <div className="flex-1 bg-slate-800 border border-slate-700 rounded-lg p-3">
                <div className="flex items-center justify-between mb-1.5">
                  <span
                    className="text-xs font-semibold uppercase tracking-wider"
                    style={{ color: COLORS[current.speaker.color] }}
                  >
                    {current.speaker.role} · {current.speaker.callsign}
                  </span>
                  <span className="text-xs text-slate-500 font-mono">{current.time}</span>
                </div>
                <p className="text-slate-100 italic">« {current.message} »</p>
              </div>
            </div>
          )}

          {needsResponse && (
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                Ta réponse (optionnelle)
              </label>
              <textarea
                value={userResponse}
                onChange={(e) => setUserResponse(e.target.value)}
                placeholder="Formule ta réponse de contrôleur..."
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/30 resize-none placeholder:text-slate-600"
                rows={3}
                disabled={revealed}
              />
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            {needsResponse && !revealed && (
              <button
                onClick={handleReveal}
                className="flex items-center gap-2 px-4 py-2 bg-amber-500/15 border border-amber-500/40 text-amber-300 rounded-lg hover:bg-amber-500/25 transition-colors text-sm font-medium"
              >
                <Eye className="w-4 h-4" />
                Voir la correction
              </button>
            )}
            {(revealed || !needsResponse) && !isLast && (
              <button
                onClick={handleNext}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 rounded-lg hover:bg-emerald-500/25 transition-colors text-sm font-medium"
              >
                Étape suivante
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
            {isLast && (revealed || !needsResponse) && (
              <>
                <button
                  onClick={handleReset}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-700 border border-slate-600 text-slate-200 rounded-lg hover:bg-slate-600 transition-colors text-sm font-medium"
                >
                  <RotateCcw className="w-4 h-4" />
                  Recommencer
                </button>
                <button
                  onClick={handleBackToMenu}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-700 border border-slate-600 text-slate-200 rounded-lg hover:bg-slate-600 transition-colors text-sm font-medium"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Choisir un autre scénario
                </button>
              </>
            )}
          </div>

          {revealed && needsResponse && (
            <div className="space-y-3 mt-4">
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center bg-amber-500/10 border border-amber-500/40">
                  <Radio className="w-5 h-5 text-amber-400" />
                </div>
                <div className="flex-1 bg-amber-500/5 border border-amber-500/30 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">AURIOL Tour</span>
                    <span className="text-xs text-slate-500">Réponse attendue</span>
                  </div>
                  <p className="text-slate-100">« {current.expectedResponse} »</p>
                </div>
              </div>

              {current.teaching && (
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center bg-emerald-500/10 border border-emerald-500/30">
                    <Lightbulb className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div className="flex-1 bg-emerald-500/5 border border-emerald-500/20 rounded-lg p-3">
                    <div className="text-xs font-semibold uppercase tracking-wider text-emerald-400 mb-1">
                      Note pédagogique
                    </div>
                    <p className="text-sm text-slate-300 leading-relaxed">{current.teaching}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {isLast && (revealed || !needsResponse) && (
            <div className="mt-6 p-6 bg-slate-800 border border-emerald-500/30 rounded-lg text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
              <h2 className="text-lg font-semibold">Scénario terminé</h2>
              <p className="text-sm text-slate-400">
                Tu as géré « {scenario.title} ». Recommence pour t'entraîner sur la fluidité, ou choisis un autre
                scénario pour varier les situations.
              </p>
            </div>
          )}
        </div>

        <div className="text-xs text-slate-500 text-center pt-4 border-t border-slate-800">
          Lis le message, formule mentalement (ou tape) ta réponse, puis vérifie la correction et la note pédagogique
          avant de passer à la suite.
        </div>
      </div>
    </div>
  );
}
