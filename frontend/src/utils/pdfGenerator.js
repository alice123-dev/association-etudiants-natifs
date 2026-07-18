import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

const COULEUR_PRIMAIRE = [15, 61, 62] // #0F3D3E
const COULEUR_ACCENT = [217, 123, 63] // #D97B3F

function ajouterEntete(doc, titre) {
  doc.setFillColor(...COULEUR_PRIMAIRE)
  doc.rect(0, 0, 210, 32, 'F')

  doc.setTextColor(255, 255, 255)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(16)
  doc.text('Association des Étudiants Natifs', 14, 15)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  doc.text(titre, 14, 23)

  doc.setTextColor(0, 0, 0)
}

function ajouterPiedDePage(doc) {
  const pageHeight = doc.internal.pageSize.height
  doc.setFontSize(8)
  doc.setTextColor(150, 150, 150)
  doc.text(
    `Généré le ${new Date().toLocaleDateString('fr-FR')} — Association des Étudiants Natifs`,
    14,
    pageHeight - 10
  )
}

export function genererRecuCotisation(cotisation) {
  const doc = new jsPDF()

  ajouterEntete(doc, 'Reçu de cotisation')

  doc.setFontSize(11)
  doc.setTextColor(80, 80, 80)
  doc.text(`Reçu N° ${cotisation.id.toString().padStart(5, '0')}`, 14, 45)

  // Encadré infos
  doc.setDrawColor(230, 230, 230)
  doc.roundedRect(14, 55, 182, 60, 3, 3)

  doc.setFontSize(10)
  doc.setTextColor(120, 120, 120)
  doc.text('Membre', 22, 68)
  doc.text('Montant', 22, 82)
  doc.text('Période', 22, 96)
  doc.text('Mode de paiement', 22, 110)

  doc.setFontSize(12)
  doc.setTextColor(30, 30, 30)
  doc.setFont('helvetica', 'bold')
  doc.text(cotisation.membreNomComplet, 70, 68)

  doc.setTextColor(...COULEUR_ACCENT)
const montantFormate = cotisation.montant.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
doc.text(`${montantFormate} Ar`, 70, 82)

  doc.setTextColor(30, 30, 30)
  doc.setFont('helvetica', 'normal')
  doc.text(cotisation.periodeLibelle, 70, 96)
  doc.text(cotisation.modePaiement, 70, 110)

  doc.setFontSize(10)
  doc.setTextColor(120, 120, 120)
  doc.text(`Date de paiement : ${cotisation.datePaiement}`, 14, 130)

  doc.setFontSize(9)
  doc.setTextColor(150, 150, 150)
  doc.text('Ce reçu confirme la réception du paiement de cotisation ci-dessus.', 14, 150)

  ajouterPiedDePage(doc)

  doc.save(`recu-cotisation-${cotisation.membreNomComplet.replace(/\s+/g, '-')}-${cotisation.periodeLibelle}.pdf`)
}

export function genererListeMembres(membres) {
  const doc = new jsPDF()

  ajouterEntete(doc, `Liste des membres — ${membres.length} membre${membres.length > 1 ? 's' : ''}`)

  const rows = membres.map((m) => [
    `${m.prenom} ${m.nom}`,
    m.email || '—',
    m.telephone || '—',
    m.filiere || '—',
    m.actif ? 'Actif' : 'Inactif',
  ])

  autoTable(doc, {
    startY: 40,
    head: [['Nom complet', 'Email', 'Téléphone', 'Filière', 'Statut']],
    body: rows,
    theme: 'striped',
    headStyles: {
      fillColor: COULEUR_PRIMAIRE,
      textColor: 255,
      fontSize: 9,
    },
    bodyStyles: {
      fontSize: 9,
    },
    alternateRowStyles: {
      fillColor: [244, 241, 234],
    },
    margin: { top: 40 },
  })

  ajouterPiedDePage(doc)

  doc.save(`liste-membres-${new Date().toISOString().split('T')[0]}.pdf`)
}