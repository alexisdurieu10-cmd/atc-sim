const SCENARIO_6_STEPS = [
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
      { id: 'F-NC', type: 'departure', x: 490, y: 195, label: 'F-NC', heading: 270 },
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
      { id: 'F-NC', type: 'departure', x: 549, y: 158, label: 'F-NC', heading: 0 },
      { id: 'F-XN', type: 'circuit', x: 549, y: 174, label: 'F-XN', heading: 0 },
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
      { id: 'F-NC', type: 'departure', x: 549, y: 158, label: 'F-NC', heading: 0 },
      { id: 'F-XN', type: 'circuit', x: 549, y: 174, label: 'F-XN', heading: 0 },
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
      { id: 'F-EN', type: 'arrival', x: 230, y: 178, label: 'F-EN', heading: 270 },
      { id: 'F-NC', type: 'departure', x: 615, y: 132, label: 'F-NC', heading: 270 },
      { id: 'F-XN', type: 'circuit', x: 549, y: 158, label: 'F-XN', heading: 0 },
    ],
  },
  {
    id: 9,
    time: '08:43:30',
    speaker: { role: 'PILOTE', callsign: 'F-XN', color: 'circuit' },
    message: "F-XN, prêt, demande départ de l'intersection",
    expectedResponse:
      'F-XN, alignez-vous, piste 27 autorisé décollage, vent 250°/10 kt, rappelez vent arrière main droite piste 27',
    teaching:
      "F-XN demande le départ depuis l'intersection H2 (pas de remontée). F-NC est aligné au seuil 27 et attend. F-EN a libéré la piste → pas de conflit. F-XN part en premier depuis H2. Le rappel vent arrière est obligatoire pour un tour de piste.",
    aircraft: [
      { id: 'F-EN', type: 'arrival', x: 210, y: 245, label: 'F-EN', heading: 0 },
      { id: 'F-NC', type: 'departure', x: 615, y: 132, label: 'F-NC', heading: 270 },
      { id: 'F-XN', type: 'circuit', x: 549, y: 132, label: 'F-XN', heading: 270 },
    ],
  },
  {
    id: 10,
    time: '08:44:00',
    speaker: { role: 'SECU', callsign: 'SÉCURITÉ', color: 'vehicle' },
    message: 'AURIOL Tour, SÉCURITÉ, demande à procéder du SSLIA au local technique',
    expectedResponse: "SÉCURITÉ, procédez point d'attente piste 27",
    teaching:
      "Piste 27 en service → « point d'attente piste 27 ». Si piste 09 en service, on dirait « point d'attente intersection H2 » (pour ne citer que la piste en service et éviter toute confusion). F-XN décolle en ce moment — SÉCURITÉ doit attendre au point d'attente avant de traverser.",
    aircraft: [
      { id: 'F-NC', type: 'departure', x: 615, y: 132, label: 'F-NC', heading: 270 },
      { id: 'F-XN', type: 'circuit', x: 480, y: 132, label: 'F-XN', heading: 270 },
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
      'F-VH, piste 27 en service, vent 250°/10 kt, QNH 1020, entrez vent arrière main droite piste 27, trafic au départ vers vent arrière, DR400, rappelez vent arrière',
    teaching:
      "F-VH arrive de Julienas (Nord) → intégration directe en vent arrière main droite, pas de vertical tour. On informe du trafic (DR400 = F-XN en montée initiale vers vent arrière). Strip bleu (arrivée).",
    aircraft: [
      { id: 'F-NC', type: 'departure', x: 540, y: 132, label: 'F-NC', heading: 270 },
      { id: 'F-XN', type: 'circuit', x: 360, y: 132, label: 'F-XN', heading: 270 },
      { id: 'F-VH', type: 'arrival', x: 740, y: 55, label: 'F-VH', heading: 225 },
      { id: 'SECU', type: 'vehicle', x: 549, y: 195, label: 'SÉCU' },
    ],
  },
  {
    id: 12,
    time: '08:45:00',
    speaker: { role: 'PILOTE', callsign: 'F-NC', color: 'departure' },
    message: 'F-NC, ready',
    expectedResponse:
      'F-NC, departure traffic joining downwind, DR400, and traffic from Julienas joining downwind, Cessna 172, runway 27 cleared for takeoff, wind 250°/10 kt',
    teaching:
      "F-XN (DR400) est en montée initiale vers vent arrière, et F-VH (C172 depuis Julienas) rejoint le vent arrière — deux trafics vers la même zone. On informe F-NC des deux avant la clairance. Ordre : infos trafic → autorisation → vent.",
    aircraft: [
      { id: 'F-NC', type: 'departure', x: 615, y: 132, label: 'F-NC', heading: 270 },
      { id: 'F-XN', type: 'circuit', x: 220, y: 132, label: 'F-XN', heading: 270 },
      { id: 'F-VH', type: 'arrival', x: 680, y: 70, label: 'F-VH', heading: 225 },
      { id: 'SECU', type: 'vehicle', x: 549, y: 158, label: 'SÉCU' },
    ],
  },
  {
    id: 13,
    time: '08:45:30',
    speaker: { role: 'SECU', callsign: 'SÉCURITÉ', color: 'vehicle' },
    message: 'SÉCURITÉ, demande traversée piste 27',
    expectedResponse: 'SÉCURITÉ, traversez piste 27',
    teaching:
      "F-NC vient de décoller et a dépassé l'extrémité de piste — piste libre. F-XN est loin en montée initiale. Pas de conflit : traversée autorisée. La priorité avait été donnée au décollage de F-NC avant la traversée de SÉCURITÉ.",
    aircraft: [
      { id: 'F-NC', type: 'departure', x: 500, y: 132, label: 'F-NC', heading: 270 },
      { id: 'F-XN', type: 'circuit', x: 180, y: 132, label: 'F-XN', heading: 270 },
      { id: 'F-VH', type: 'arrival', x: 600, y: 80, label: 'F-VH', heading: 225 },
      { id: 'SECU', type: 'vehicle', x: 549, y: 158, label: 'SÉCU' },
    ],
  },
  {
    id: 14,
    time: '08:46:00',
    speaker: { role: 'PILOTE', callsign: 'F-TZ', color: 'circuit' },
    message:
      'AURIOL Tower, FMATZ, Transall, from ORLEANS via Morgon, airfield estimated in 5 minutes, for a touch and go, then back to ORLEANS via Saint-Amour',
    expectedResponse:
      'F-TZ, runway 27 in use, wind 250°/10 kt, QNH 1020, join right hand downwind runway 27 via overhead tower, report overhead tower',
    teaching:
      "F-TZ arrive depuis Morgon (Sud) → vertical tour obligatoire. Le QNH est donné pour le réglage altimétrique. Strip rouge+bleu (toucher suivi d'un retour à Orléans = tour de piste unique). Pilote anglais — on répond en anglais.",
    aircraft: [
      { id: 'F-XN', type: 'circuit', x: 180, y: 100, label: 'F-XN', heading: 90 },
      { id: 'F-VH', type: 'arrival', x: 340, y: 100, label: 'F-VH', heading: 90 },
      { id: 'F-TZ', type: 'circuit', x: 370, y: 390, label: 'F-TZ', heading: 0 },
      { id: 'SECU', type: 'vehicle', x: 549, y: 95, label: 'SÉCU' },
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
      { id: 'F-VH', type: 'arrival', x: 380, y: 100, label: 'F-VH', heading: 90 },
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
      'F-TZ, traffic from Julienas joining downwind, Cessna 172, and departure traffic towards Saint-Amour, DA42, report downwind',
    teaching:
      "F-TZ passe le vertical tour. On l'informe de F-VH (Cessna 172 de Julienas, en vent arrière) et de F-NC (DA42 au départ vers Saint-Amour, encore sur fréquence). Deux informations dans un seul message. On demande le rappel vent arrière.",
    aircraft: [
      { id: 'F-XN', type: 'circuit', x: 350, y: 100, label: 'F-XN', heading: 90 },
      { id: 'F-VH', type: 'arrival', x: 450, y: 100, label: 'F-VH', heading: 90 },
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
      { id: 'F-EP', type: 'departure', x: 440, y: 195, label: 'F-EP', heading: 90 },
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
      { id: 'F-EP', type: 'departure', x: 549, y: 158, label: 'F-EP', heading: 0 },
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
      { id: 'F-EP', type: 'departure', x: 549, y: 158, label: 'F-EP', heading: 0 },
    ],
  },
  {
    id: 24,
    time: '08:51:30',
    speaker: { role: 'PILOTE', callsign: 'F-ML', color: 'transit' },
    message:
      'AURIOL Tower, FGHML, Tobago, transit from DIJON to NICE via North, 3000 ft QNH, over airfield estimated in 5 minutes, exit via Fleurie',
    expectedResponse: 'F-ML, runway 27 in use, QNH 1020, report overhead airfield',
    teaching:
      "Transit VFR : pas de clairance d'atterrissage. On donne la piste en service et le QNH (altimétrie). Pas d'instruction de vent — le transit ne se pose pas. Le transit à 3000 ft QNH ne conflifte pas avec le circuit (1400 ft QNH). On demande le rappel vertical aérodrome.",
    aircraft: [
      { id: 'F-VH', type: 'arrival', x: 200, y: 100, label: 'F-VH', heading: 90 },
      { id: 'F-TZ', type: 'circuit', x: 550, y: 100, label: 'F-TZ', heading: 90 },
      { id: 'F-EP', type: 'departure', x: 549, y: 158, label: 'F-EP', heading: 0 },
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
      { id: 'F-EP', type: 'departure', x: 549, y: 158, label: 'F-EP', heading: 0 },
      { id: 'F-ML', type: 'transit', x: 370, y: 155, label: 'F-ML', heading: 180 },
    ],
    showPattern: true,
  },

  {
    id: 26,
    time: '08:52:05',
    speaker: { role: 'PILOTE', callsign: 'F-GS', color: 'arrival' },
    message: 'AURIOL Tour, FBVGS, Cessna 172, provenance LYON via le Sud-Est, aérodrome estimé dans 5 minutes, pour atterrissage',
    expectedResponse: 'F-GS, piste 27 en service, vent 250°/10 kt, QNH 1020, entrez vent arrière main droite piste 27 via vertical tour, trafic en vent arrière Cessna 172 et transit Tobago, rappelez vertical tour',
    teaching: "F-GS arrive du Sud-Est → vertical tour obligatoire. F-VH (Cessna 172) est en vent arrière et F-ML (Tobago) est en transit à 3000 ft. Double info trafic. Strip bleu.",
    aircraft: [
      { id: 'F-VH', type: 'arrival', x: 280, y: 100, label: 'F-VH', heading: 90 },
      { id: 'F-TZ', type: 'circuit', x: 570, y: 100, label: 'F-TZ', heading: 90 },
      { id: 'F-EP', type: 'departure', x: 549, y: 158, label: 'F-EP', heading: 0 },
      { id: 'F-ML', type: 'transit', x: 370, y: 155, label: 'F-ML', heading: 180 },
      { id: 'F-YH', type: 'arrival', x: 70, y: 375, label: 'F-YH', heading: 45 },
      { id: 'F-GS', type: 'arrival', x: 700, y: 380, label: 'F-GS', heading: 315 },
    ],
    showPattern: true,
  },  {
    id: 27,
    time: '08:52:30',
    speaker: { role: 'PILOTE', callsign: 'F-YH', color: 'arrival' },
    message:
      'AURIOL Tour, FBXYH, Cessna 172, provenance RODEZ via le Sud-Ouest, aérodrome estimé dans 5 minutes, pour atterrissage',
    expectedResponse:
      'F-YH, piste 27 en service, vent 250°/10 kt, QNH 1020, entrez vent arrière main droite piste 27 via vertical tour, rappelez vertical tour — F-YH, trafic du Nord vers vertical, Tobago',
    teaching:
      "F-YH arrive du Sud-Ouest → vertical tour obligatoire. F-ML (transit Tobago, venant du Nord) converge également vers le vertical aérodrome : info trafic réciproque obligatoire dans les deux sens. Le message peut être scindé en deux (livret 6). Il faut aussi informer F-ML (en anglais) : « F-ML, traffic from the South-West joining overhead, Cessna 172 ».",
    aircraft: [
      { id: 'F-VH', type: 'arrival', x: 200, y: 100, label: 'F-VH', heading: 90 },
      { id: 'F-TZ', type: 'circuit', x: 570, y: 100, label: 'F-TZ', heading: 90 },
      { id: 'F-EP', type: 'departure', x: 549, y: 158, label: 'F-EP', heading: 0 },
      { id: 'F-ML', type: 'transit', x: 370, y: 185, label: 'F-ML', heading: 180 },
      { id: 'F-YH', type: 'arrival', x: 70, y: 375, label: 'F-YH', heading: 45 },
    ],
  },
  {
    id: 28,
    time: '08:52:50',
    speaker: { role: 'PILOTE', callsign: 'F-VH', color: 'arrival' },
    message: 'F-VH, vent arrière main droite piste 27',
    expectedResponse: 'F-VH, numéro 2, suivez un Transall en finale, rappelez finale',
    teaching:
      "F-VH a effectué sa remise de gaz et a rejoint le vent arrière. F-TZ (Transall) est en finale. On séquence F-VH en n°2 derrière le Transall. Le transit F-ML (3000 ft) ne conflifte pas avec le circuit (1400 ft).",
    aircraft: [
      { id: 'F-VH', type: 'arrival', x: 280, y: 100, label: 'F-VH', heading: 90 },
      { id: 'F-TZ', type: 'circuit', x: 605, y: 132, label: 'F-TZ', heading: 270 },
      { id: 'F-EP', type: 'departure', x: 549, y: 158, label: 'F-EP', heading: 0 },
      { id: 'F-ML', type: 'transit', x: 370, y: 235, label: 'F-ML', heading: 180 },
      { id: 'F-YH', type: 'arrival', x: 160, y: 355, label: 'F-YH', heading: 45 },
    ],
    showPattern: true,
  },

  {
    id: 29,
    time: '08:52:55',
    speaker: { role: 'PILOTE', callsign: 'F-GS', color: 'arrival' },
    message: 'F-GS, vertical tour',
    expectedResponse: 'F-GS, numéro 3, suivez un Cessna 172 en vent arrière, rappelez vent arrière',
    teaching: "F-TZ (Transall, #1) est en finale. F-VH (Cessna 172, #2) est en vent arrière. F-GS est #3. Trois appareils en circuit — séquencement 3 avions.",
    aircraft: [
      { id: 'F-VH', type: 'arrival', x: 340, y: 100, label: 'F-VH', heading: 90 },
      { id: 'F-TZ', type: 'circuit', x: 605, y: 132, label: 'F-TZ', heading: 270 },
      { id: 'F-EP', type: 'departure', x: 549, y: 158, label: 'F-EP', heading: 0 },
      { id: 'F-ML', type: 'transit', x: 370, y: 235, label: 'F-ML', heading: 180 },
      { id: 'F-YH', type: 'arrival', x: 160, y: 355, label: 'F-YH', heading: 45 },
      { id: 'F-GS', type: 'arrival', x: 370, y: 275, label: 'F-GS', heading: 0 },
    ],
    showPattern: true,
  },  {
    id: 30,
    time: '08:53:00',
    speaker: { role: 'PILOTE', callsign: 'F-ML', color: 'transit' },
    message: 'F-ML, overhead airfield',
    expectedResponse: 'F-ML, report Fleurie',
    teaching:
      "F-ML passe le vertical aérodrome à 3000 ft. On lui demande de rappeler en passant à Fleurie (son prochain point VFR sur la route vers Nice). Ce report marque la fin de sa traversée de la zone.",
    aircraft: [
      { id: 'F-VH', type: 'arrival', x: 320, y: 100, label: 'F-VH', heading: 90 },
      { id: 'F-TZ', type: 'circuit', x: 605, y: 132, label: 'F-TZ', heading: 270 },
      { id: 'F-EP', type: 'departure', x: 549, y: 158, label: 'F-EP', heading: 0 },
      { id: 'F-ML', type: 'transit', x: 370, y: 260, label: 'F-ML', heading: 180 },
      { id: 'F-YH', type: 'arrival', x: 260, y: 305, label: 'F-YH', heading: 45 },
    ],
  },
  {
    id: 31,
    time: '08:53:30',
    speaker: { role: 'PILOTE', callsign: 'F-TZ', color: 'circuit' },
    message: 'F-TZ, final runway 27 for a touch and go',
    expectedResponse: 'F-TZ, runway 27 cleared touch and go, wind 250°/10 kt',
    teaching:
      "Piste libre. On autorise le toucher du Transall. On note précisément l'heure du lever des roues (hh:mm:ss) en anticipation d'un possible délai de turbulence de sillage : F-VH (C172, cat. L) suit F-TZ (Transall, cat. M) → délai minimum 2 minutes si F-VH décolle après F-TZ. Pour l'atterrissage, vérifier que la piste est dégagée de la turbulence.",
    aircraft: [
      { id: 'F-VH', type: 'arrival', x: 380, y: 100, label: 'F-VH', heading: 90 },
      { id: 'F-TZ', type: 'circuit', x: 605, y: 132, label: 'F-TZ', heading: 270 },
      { id: 'F-EP', type: 'departure', x: 549, y: 158, label: 'F-EP', heading: 0 },
      { id: 'F-YH', type: 'arrival', x: 350, y: 270, label: 'F-YH', heading: 0 },
    ],
  },

  {
    id: 32,
    time: '08:53:45',
    speaker: { role: 'PILOTE', callsign: 'F-GS', color: 'arrival' },
    message: 'F-GS, vent arrière main droite piste 27',
    expectedResponse: 'F-GS, numéro 2, suivez un Cessna 172 en base, rappelez finale',
    teaching: "F-TZ (#1) est loin en finale pour son toucher. F-VH (#2) tourne en base. F-GS est #2 effectif derrière F-VH. Rappelez finale.",
    aircraft: [
      { id: 'F-VH', type: 'arrival', x: 430, y: 100, label: 'F-VH', heading: 90 },
      { id: 'F-TZ', type: 'circuit', x: 605, y: 132, label: 'F-TZ', heading: 270 },
      { id: 'F-EP', type: 'departure', x: 549, y: 158, label: 'F-EP', heading: 0 },
      { id: 'F-YH', type: 'arrival', x: 260, y: 305, label: 'F-YH', heading: 45 },
      { id: 'F-GS', type: 'arrival', x: 175, y: 100, label: 'F-GS', heading: 90 },
    ],
    showPattern: true,
  },  {
    id: 33,
    time: '08:54:00',
    speaker: { role: 'PILOTE', callsign: 'F-ML', color: 'transit' },
    message: 'F-ML, Fleurie, leaving frequency',
    expectedResponse: 'F-ML, roger, goodbye',
    teaching:
      "F-ML passe Fleurie et quitte la fréquence pour contacter l'organisme suivant. Accusé de réception, heure de dernier contact notée, strip archivé.",
    aircraft: [
      { id: 'F-VH', type: 'arrival', x: 430, y: 100, label: 'F-VH', heading: 90 },
      { id: 'F-TZ', type: 'circuit', x: 300, y: 132, label: 'F-TZ', heading: 270 },
      { id: 'F-EP', type: 'departure', x: 549, y: 158, label: 'F-EP', heading: 0 },
      { id: 'F-YH', type: 'arrival', x: 370, y: 260, label: 'F-YH', heading: 0 },
    ],
  },
  {
    id: 34,
    time: '08:54:20',
    speaker: { role: 'PILOTE', callsign: 'F-YH', color: 'arrival' },
    message: 'F-YH, vertical tour',
    expectedResponse: 'F-YH, rappelez vent arrière',
    teaching:
      "F-YH passe le vertical tour après son arrivée par le Sud-Ouest. Il va rejoindre le vent arrière main droite piste 27. On demande simplement le rappel vent arrière — il sera séquencé derrière F-VH.",
    aircraft: [
      { id: 'F-VH', type: 'arrival', x: 460, y: 100, label: 'F-VH', heading: 90 },
      { id: 'F-TZ', type: 'circuit', x: 175, y: 132, label: 'F-TZ', heading: 270 },
      { id: 'F-EP', type: 'departure', x: 549, y: 158, label: 'F-EP', heading: 0 },
      { id: 'F-YH', type: 'arrival', x: 370, y: 260, label: 'F-YH', heading: 0 },
    ],
    showPattern: true,
  },
  {
    id: 35,
    time: '08:55:00',
    speaker: { role: 'PILOTE', callsign: 'F-VH', color: 'arrival' },
    message: 'F-VH, finale piste 27',
    expectedResponse: 'F-VH, piste 27 autorisé atterrissage, vent 250°/10 kt',
    teaching:
      "F-TZ (Transall, cat. M) a touché et redécollé vers le Nord. F-VH (C172, cat. L) atterrit sur la piste 27 — les trajectoires divergent (Transall part au Nord, C172 atterrit à l'Ouest). Pas de problème de turbulence de sillage sur l'axe d'atterrissage. Piste libre : atterrissage autorisé.",
    aircraft: [
      { id: 'F-VH', type: 'arrival', x: 605, y: 132, label: 'F-VH', heading: 270 },
      { id: 'F-TZ', type: 'circuit', x: 130, y: 85, label: 'F-TZ', heading: 45 },
      { id: 'F-EP', type: 'departure', x: 549, y: 158, label: 'F-EP', heading: 0 },
      { id: 'F-YH', type: 'arrival', x: 175, y: 100, label: 'F-YH', heading: 90 },
    ],
  },
  {
    id: 36,
    time: '08:55:30',
    speaker: { role: 'PILOTE', callsign: 'F-TZ', color: 'circuit' },
    message: 'F-TZ, leaving frequency, back to Orléans via Saint-Amour',
    expectedResponse: 'F-TZ, roger, goodbye',
    teaching:
      "F-TZ a accompli son toucher-roulé-décollage et quitte la fréquence pour rentrer à Orléans via Saint-Amour (NE). Strip archivé avec heure de dernier contact.",
    aircraft: [
      { id: 'F-VH', type: 'arrival', x: 340, y: 178, label: 'F-VH', heading: 270 },
      { id: 'F-EP', type: 'departure', x: 549, y: 158, label: 'F-EP', heading: 0 },
      { id: 'F-YH', type: 'arrival', x: 280, y: 100, label: 'F-YH', heading: 90 },
    ],
  },
  {
    id: 37,
    time: '08:56:00',
    speaker: { role: 'PILOTE', callsign: 'F-VH', color: 'arrival' },
    message: 'F-VH, piste dégagée, demande roulage',
    expectedResponse: 'F-VH, roulez poste D1',
    teaching:
      "F-VH libère la piste. On lui attribue le poste D1 (parking aéroclub). Note Livret 2 : le parking D n'est pas visible depuis la tour — si le pilote avait demandé lui-même « parking D », on n'aurait pas à lui désigner de poste spécifique.",
    aircraft: [
      { id: 'F-VH', type: 'arrival', x: 250, y: 178, label: 'F-VH', heading: 270 },
      { id: 'F-EP', type: 'departure', x: 549, y: 158, label: 'F-EP', heading: 0 },
      { id: 'F-YH', type: 'arrival', x: 380, y: 100, label: 'F-YH', heading: 90 },
    ],
    showPattern: true,
  },

  {
    id: 38,
    time: '08:56:05',
    speaker: { role: 'PILOTE', callsign: 'F-GS', color: 'arrival' },
    message: 'F-GS, finale piste 27',
    expectedResponse: 'F-GS, piste 27 autorisé atterrissage, vent 250°/10 kt',
    teaching: "F-VH vient de dégager la piste. F-TZ a quitté la fréquence. F-YH est en vent arrière — aucun conflit. Piste libre, on autorise F-GS.",
    aircraft: [
      { id: 'F-EP', type: 'departure', x: 549, y: 158, label: 'F-EP', heading: 0 },
      { id: 'F-YH', type: 'arrival', x: 430, y: 100, label: 'F-YH', heading: 90 },
      { id: 'F-GS', type: 'arrival', x: 605, y: 132, label: 'F-GS', heading: 270 },
    ],
  },  {
    id: 39,
    time: '08:57:00',
    speaker: { role: 'PILOTE', callsign: 'F-EP', color: 'departure' },
    message: 'F-EP, prêt, demande remontée piste 27',
    expectedResponse: "F-EP, maintenez avant point d'attente piste 27, Cessna 172 en vent arrière",
    teaching:
      "Verrou de piste piste 27 pour une remontée : la piste est verrouillée dès que l'arrivée passe le travers tour en vent arrière. F-YH est en vent arrière et a dépassé le travers tour → on maintient F-EP au point d'attente avec l'info trafic.",
    aircraft: [
      { id: 'F-EP', type: 'departure', x: 549, y: 158, label: 'F-EP', heading: 0 },
      { id: 'F-YH', type: 'arrival', x: 430, y: 100, label: 'F-YH', heading: 90 },
    ],
    showPattern: true,
  },

  {
    id: 40,
    time: '08:56:20',
    speaker: { role: 'PILOTE', callsign: 'F-GS', color: 'arrival' },
    message: 'F-GS, piste dégagée, demande roulage',
    expectedResponse: 'F-GS, roulez poste D2',
    teaching: "F-GS libère la piste. Poste D2 (parking aéroclub). Strip archivé.",
    aircraft: [
      { id: 'F-EP', type: 'departure', x: 549, y: 158, label: 'F-EP', heading: 0 },
      { id: 'F-YH', type: 'arrival', x: 430, y: 100, label: 'F-YH', heading: 90 },
      { id: 'F-GS', type: 'arrival', x: 250, y: 178, label: 'F-GS', heading: 270 },
    ],
  },  {
    id: 41,
    time: '08:57:30',
    speaker: { role: 'PILOTE', callsign: 'F-YH', color: 'arrival' },
    message: 'F-YH, vent arrière main droite piste 27',
    expectedResponse: 'F-YH, numéro 1, rappelez finale piste 27',
    teaching:
      "F-YH est seul dans le circuit. Numéro 1, rappel en finale. F-EP reste au point d'attente — le verrou reste actif tant que F-YH n'a pas dégagé la piste.",
    aircraft: [
      { id: 'F-EP', type: 'departure', x: 549, y: 158, label: 'F-EP', heading: 0 },
      { id: 'F-YH', type: 'arrival', x: 480, y: 100, label: 'F-YH', heading: 90 },
    ],
    showPattern: true,
  },

  {
    id: 42,
    time: '08:56:30',
    speaker: { role: 'PILOTE', callsign: 'F-DM', color: 'departure' },
    message: 'AURIOL Tour, FBVDM, Robin DR400, poste C2, destination DIJON via le Nord, demande roulage',
    expectedResponse: "F-DM, piste 27 en service, vent 250°/10 kt, QNH 1020, roulez point d'attente piste 27",
    teaching: "F-DM au poste C2. F-EP est déjà au point d'attente. F-DM arrive derrière F-EP. Strip rouge (départ).",
    aircraft: [
      { id: 'F-EP', type: 'departure', x: 549, y: 158, label: 'F-EP', heading: 0 },
      { id: 'F-YH', type: 'arrival', x: 430, y: 100, label: 'F-YH', heading: 90 },
      { id: 'F-DM', type: 'departure', x: 405, y: 245, label: 'F-DM', heading: 0 },
    ],
    showPattern: true,
  },  {
    id: 43,
    time: '08:58:30',
    speaker: { role: 'PILOTE', callsign: 'F-YH', color: 'arrival' },
    message: 'F-YH, finale piste 27',
    expectedResponse: 'F-YH, piste 27 autorisé atterrissage, vent 250°/10 kt',
    teaching:
      "F-YH est en finale. Piste libre. Atterrissage autorisé. F-EP reste maintenu — on attend que F-YH atterrisse et dégage la piste avant d'autoriser la remontée.",
    aircraft: [
      { id: 'F-EP', type: 'departure', x: 549, y: 158, label: 'F-EP', heading: 0 },
      { id: 'F-YH', type: 'arrival', x: 605, y: 132, label: 'F-YH', heading: 270 },
    ],
  },
  {
    id: 44,
    time: '08:59:30',
    speaker: { role: 'PILOTE', callsign: 'F-YH', color: 'arrival' },
    message: 'F-YH, piste dégagée, demande roulage',
    expectedResponse: 'F-YH, roulez poste C3',
    teaching:
      "F-YH a libéré la piste — poste C3 attribué (C172 au parking principal). La piste est maintenant disponible pour F-EP. On peut enchaîner immédiatement avec la clairance de remontée.",
    aircraft: [
      { id: 'F-EP', type: 'departure', x: 549, y: 158, label: 'F-EP', heading: 0 },
      { id: 'F-YH', type: 'arrival', x: 280, y: 178, label: 'F-YH', heading: 270 },
    ],
  },

  {
    id: 45,
    time: '08:59:40',
    speaker: { role: 'PILOTE', callsign: 'F-DM', color: 'departure' },
    message: 'F-DM, prêt',
    expectedResponse: "F-DM, maintenez avant point d'attente piste 27, trafic au départ, BE200",
    teaching: "F-EP (Beech 200) est en tête et partira en premier. F-DM maintient jusqu'au départ de F-EP.",
    aircraft: [
      { id: 'F-EP', type: 'departure', x: 615, y: 132, label: 'F-EP', heading: 270 },
      { id: 'F-DM', type: 'departure', x: 549, y: 158, label: 'F-DM', heading: 0 },
    ],
  },  {
    id: 46,
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

  {
    id: 47,
    time: '09:00:30',
    speaker: { role: 'PILOTE', callsign: 'F-DM', color: 'departure' },
    message: 'F-DM, prêt',
    expectedResponse: 'F-DM, alignez-vous, piste 27 autorisé décollage, vent 250°/10 kt',
    teaching: "F-EP vient de décoller. Piste libre, aucun trafic en approche. On autorise F-DM.",
    aircraft: [
      { id: 'F-EP', type: 'departure', x: 400, y: 132, label: 'F-EP', heading: 270 },
      { id: 'F-DM', type: 'departure', x: 615, y: 132, label: 'F-DM', heading: 270 },
    ],
  },
  {
    id: 48,
    time: '09:01:30',
    speaker: { role: 'PILOTE', callsign: 'F-DM', color: 'departure' },
    message: 'F-DM, je quitte la fréquence, bonjour',
    expectedResponse: 'F-DM, roger, au revoir',
    teaching: "F-DM quitte la fréquence pour Dijon via le Nord. Accusé de réception, heure notée, strip archivé.",
    aircraft: [
      { id: 'F-DM', type: 'departure', x: 200, y: 100, label: 'F-DM', heading: 315 },
    ],
  },];
