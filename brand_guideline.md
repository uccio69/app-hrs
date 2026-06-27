# Brand Guidelines per "Antigravity" - HR Support Web App

Questo documento contiene le direttive visive e strutturali da utilizzare per la costruzione del layout della web app di **HR Support**. Passa questo file all'engine "Antigravity" per assicurare coerenza con la brand identity del sito www.hrsupport.it.

## 1. Identità del Brand
- **Nome Azienda**: HR Support (Soluzioni per Human Resource, Welfare e Sviluppo Software)
- **Settore**: Consulenza del Lavoro, Payroll, Welfare, Sviluppo Software.
- **Stile Generale**: Professionale, pulito, affidabile, tecnologico (modern corporate).

## 2. Risorse Grafiche (Loghi)
Antigravity dovrà utilizzare i seguenti asset per l'header, il footer e le favicon.

- **Logo Principale (Header/Light Background)**: 
  - URL di riferimento (dal sito): `/assets/logo.png` *(sostituire con path relativo se in locale, es. `/assets/logo-main.svg`)*
- **Logo Alternativo (Footer/Dark Background)**: Utilizzare una versione in negativo (bianca) del logo principale.
- **Favicon**: Estrapolare il pittogramma dal logo principale.

## 3. Palette Colori
I colori sono ispirati all'identità visiva istituzionale tipica del settore HR e consulenza, basata sul sito aziendale.

### Colori Principali (Brand Colors)
- **Primary Color**: `#0056b3` (Blu Corporate - trasmette fiducia e professionalità)
- **Primary Hover**: `#004494`
- **Secondary Color**: `#f2f2f2` (Grigio chiaro per sezioni secondarie)
- **Accent Color**: `#ff9900` (Arancione/Giallo scuro per Call to Action importanti come "Contattaci ora!")

### Colori di Base (Neutrals & UI)
- **Background**: `#ffffff` (Bianco puro per massima leggibilità)
- **Surface/Card Background**: `#f8f9fa`
- **Text Main**: `#333333` (Grigio scuro per testo principale, non usare nero puro per affaticare meno la vista)
- **Text Muted**: `#666666` (Per testi secondari, date, o breadcrumb)
- **Border/Divider**: `#e0e0e0`

### Colori di Stato (Feedback)
- **Success**: `#28a745`
- **Warning**: `#ffc107`
- **Error/Danger**: `#dc3545`
- **Info**: `#17a2b8`

## 4. Tipografia
Il sito HR Support utilizza font chiari, sans-serif e leggibili, ottimizzati per la lettura a schermo di dati gestionali.

- **Font Principale (Primary Font)**: `Open Sans`, `Roboto`, o `Inter` (sans-serif)
- **Fallback**: `Helvetica Neue, Arial, sans-serif`

### Gerarchia Testuale
- **H1 (Titoli di pagina)**: 32px (Mobile: 28px) - *Font-weight: 700 (Bold)* - Colore: Primary o Text Main.
- **H2 (Titoli di sezione)**: 24px (Mobile: 22px) - *Font-weight: 600 (Semi-bold)*.
- **H3 (Sottotitoli/Card Titles)**: 20px - *Font-weight: 600*.
- **Body Testo Regolare**: 16px - *Font-weight: 400 (Regular)* - Line-height: 1.5.
- **Small Text (Label/Footer)**: 14px - *Font-weight: 400*.

## 5. Componenti UI per Antigravity

### Pulsanti (Buttons)
I pulsanti devono essere chiari e facilmente cliccabili (touch-friendly).
- **Primary Button**: Background `Primary Color`, Testo `#ffffff`, Border-radius `4px` o `6px`. Nessun bordo. Al passaggio del mouse (Hover), usare `Primary Hover`.
- **Secondary/Outline Button**: Background trasparente, Bordo `2px solid Primary Color`, Testo `Primary Color`.
- **Padding Pulsanti**: `10px 20px` (standard).

### Form e Input (Gestionali)
Trattandosi di software gestionale (HR Gest), i form devono essere puliti.
- **Input Background**: `#ffffff`
- **Input Border**: `1px solid #cccccc`
- **Focus State**: Bordo `Primary Color` e leggero box-shadow esterno azzurro (es. `box-shadow: 0 0 5px rgba(0,86,179, 0.3)`).
- **Label**: Sopra il campo di input, `14px`, `Font-weight: 600`.

### Tabelle e Card
- **Card**: Background `#ffffff`, Border-radius `8px`, Shadow molto leggera (`box-shadow: 0 4px 6px rgba(0,0,0,0.05)`).
- **Tabelle Dati (Welfare/Payroll)**: Zebra-striping (righe alternate con background `#f8f9fa` e `#ffffff`). Header della tabella in `Secondary Color` con testo in grassetto.

## 6. Spaziature e Layout (Spacing System)
Utilizzare un sistema su base 8px.
- **Container Max-width**: `1200px` (per mantenere il contenuto leggibile sui monitor grandi).
- **Margini tra sezioni**: `64px` (Desktop) / `32px` (Mobile).
- **Padding interno alle Card**: `24px`.
- **Spaziatura tra elementi UI (Gap)**: `16px`.

## 7. Regole Specifiche per il Layout App (Antigravity Directives)
1. **Sidebar Navigation**: Prevedere una sidebar laterale collassabile per la dashboard del software ("HR AREA", "HR GEST STUDIO", "HR GEST AZIENDA"), con icone in SVG.
2. **Top Bar**: Deve contenere il logo in alto a sinistra, e a destra breadcrumb, area utente e un pulsante per il "Welfare" o notifiche.
3. **Responsive**: Tutti gli elementi devono scalare fluidamente (Mobile-first approccio). La sidebar si trasforma in un menu hamburger su device mobili (max-width: 768px).