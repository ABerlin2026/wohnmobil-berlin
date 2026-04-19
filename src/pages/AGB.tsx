import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import PageSEO from "@/components/PageSEO";

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="space-y-3">
    <h2 className="font-display font-semibold text-foreground text-base md:text-lg">{title}</h2>
    <div className="space-y-3 text-secondary-foreground">{children}</div>
  </section>
);

const AGB = () => {
  return (
    <>
      <PageSEO
        title="AGB | Camper Berlin Brandenburg"
        description="Allgemeine Mietbedingungen (AGB) für die Wohnmobilvermietung von Camper Berlin Brandenburg – Stand 08/2022."
        canonical="https://camper-berlin-brandenburg.de/agb"
        breadcrumbs={[
          { name: "Startseite", url: "https://camper-berlin-brandenburg.de/" },
          { name: "AGB", url: "https://camper-berlin-brandenburg.de/agb" },
        ]}
      />
      <Navigation />
      <main className="section-padding bg-background min-h-screen pt-32">
        <div className="container-narrow max-w-3xl">
          <h1 className="text-3xl md:text-4xl font-display font-bold mb-3">
            Allgemeine Mietbedingungen
          </h1>
          <p className="text-sm text-muted-foreground mb-10">Stand: August 2022</p>

          <div className="space-y-10 text-sm leading-relaxed">
            <p className="font-medium text-foreground">
              Mehrere Mieter bilden eine Mietergemeinschaft. Jeder Mieter hat identische Rechte und Pflichten.
            </p>

            <Section title="Zustandekommen des verbindlichen Mietvertrages">
              <p>
                Absprachen oder Erklärungen, die nur mündlich, ohne schriftliche Bestätigung, per E-Mail oder
                SMS erfolgt sind, sind in jedem Fall ohne rechtliche Wirkung. Der Abschluss eines Mietvertrages
                über das Fahrzeug kann nur schriftlich, in der Regel durch beiderseitige Unterschrift dieses
                Vertrages erfolgen.
              </p>
              <p>
                Der Mietvertrag kommt zwischen den Vertragsparteien zustande. Eine Übertragung oder Abtretung
                der Rechte aus dem Mietvertrag durch den Mieter auf andere dritte Personen ist nur mit
                ausdrücklicher schriftlicher vorheriger Zustimmung des Vermieters möglich.
              </p>
              <p>
                Das Fahrzeug darf ohne vorherige schriftliche Zustimmung des Vermieters nicht dritten Personen
                zum Gebrauch überlassen werden, es darf nur von den im Mietvertrag genannten Fahrern / Mietern
                gefahren werden.
              </p>
            </Section>

            <Section title="Kündigung, Stornierungen">
              <p>
                Ist ein Termin für die Rückgabe des Fahrzeugs nicht bestimmt (unbefristetes Mietverhältnis),
                so kann das Mietverhältnis von beiden Parteien unter Einhaltung der gesetzlichen
                Kündigungsfrist (§ 580a BGB) gekündigt werden.
              </p>
              <p>
                Bei befristet abgeschlossenen Mietverträgen ist die vereinbarte Mietdauer (Termine) für beide
                Parteien verbindlich, sie kann nur im gegenseitigen Einvernehmen verlängert oder verkürzt
                werden.
              </p>
              <p>
                Eine Kündigung oder Stornierung des Vertrages ist, außer bei Vorliegen eines wichtigen Grundes
                im Sinne von § 543 BGB, beiderseitig ausgeschlossen.
              </p>
              <p>
                Der Mieter ist verpflichtet, das Fahrzeug spätestens zum angegebenen Zeitpunkt an den
                Vermieter zurückzugeben. Sofern der Mieter das Fahrzeug selbst beim Vermieter abgeholt hat,
                ist er verpflichtet, das Fahrzeug zum Vermieter zurückzubringen. Sofern Abholung durch den
                Vermieter vereinbart ist, ist das Fahrzeug zum angegebenen Zeitpunkt zur Abholung am
                vereinbarten Ort vom Mieter bereitzustellen.
              </p>
              <p>
                Das Mietverhältnis verlängert sich nicht automatisch, wenn der Mieter das Fahrzeug nicht
                termingerecht zurückbringt und dem Vermieter übergibt. Im Falle einer verspäteten Rückgabe
                kann der Vermieter eine Entschädigung gemäß § 546 BGB in Höhe des vereinbarten Mietpreises vom
                Mieter verlangen.
              </p>
            </Section>

            <Section title="Nutzung und Nutzungsverbote des Mietfahrzeugs">
              <p>
                Die Benutzung des Fahrzeugs ist ausschließlich innerhalb der Europäischen Union (EU)
                gestattet. Außerhalb dieser Grenzen besteht in der Kraftfahrversicherung (insbesondere
                Vollkaskoschutz) kein Versicherungsschutz. Will der Mieter das Fahrzeug in anderen Ländern und
                Gebieten benutzen, so ist hierzu eine schriftliche vorherige Zustimmung des Vermieters
                erforderlich.
              </p>
              <p>Vom Vermieter generell nicht gestattet ist die Nutzung des Fahrzeugs zu folgenden Zwecken:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Teilnahme an Wettrennen, Fahrertraining, Geländefahrten und ähnlichen Nutzungen.</li>
                <li>Beförderung von leicht entzündlichen, giftigen oder sonst gefährlichen Stoffen.</li>
                <li>
                  Jegliche Verwendung im Zusammenhang mit der Begehung von Straftaten oder Zoll- und
                  Steuervergehen, insbesondere dem Transport von Stoffen, die unter das
                  Betäubungsmittelgesetz fallen.
                </li>
              </ul>
              <p>
                Die Benutzung des Fahrzeugs ist nicht gestattet, sofern der Mieter oder Fahrer nicht im Besitz
                einer gültigen, in Deutschland anerkannten Fahrerlaubnis ist, ein Fahrverbot besteht oder die
                Fahrerlaubnis vorläufig entzogen ist.
              </p>
              <p>
                Die Benutzung des Fahrzeugs ist nicht gestattet, sofern der Fahrer infolge Genusses
                alkoholischer Getränke oder anderer berauschender Mittel nicht in der Lage ist, das Fahrzeug
                sicher zu führen (fahruntüchtiger Fahrer).
              </p>
              <p>
                Hält sich der Mieter nicht an die vorstehend vereinbarten Nutzungsverbote, liegt eine
                Pflichtverletzung des Mieters beim Gebrauch des Fahrzeugs vor.
              </p>
            </Section>

            <Section title="Kleinreparaturen, Kraftstoffe, Öle">
              <p>
                Der während der Mietdauer verbrauchte Kraftstoff, Motoröl und andere Hilfs- und
                Betriebsstoffe sind vom Mieter auf eigene Kosten zu beschaffen.
              </p>
              <p>
                Kleine Instandsetzungen wie zum Beispiel der Austausch von Glühbirnen kann der Mieter selbst
                vornehmen oder bis zur Höhe von 150 € je Einzelfall ohne vorherige Absprache mit dem Vermieter
                durch eine Fachwerkstatt ausführen lassen. Der Vermieter erstattet dem Mieter die Kosten gegen
                Vorlage eines Rechnungsbeleges und Vorlage des ausgetauschten beschädigten Teiles. Keine
                Kostenerstattung ohne Rechnungsbeleg. Eigenleistungen des Mieters werden nicht vergütet.
              </p>
            </Section>

            <Section title="Fürsorgepflichten des Mieters und Haftung für Schäden">
              <p>
                Der Mieter ist verpflichtet, das Fahrzeug vor der Übernahme genauestens zu überprüfen. Falls
                Beschädigungen oder Mängel festgestellt werden, zeigt der Mieter diese dem Vermieter in
                Textform (z. B. per E-Mail) an.
              </p>
              <p>
                Der Mieter ist verpflichtet, das Fahrzeug ab dem Zeitpunkt der Übergabe so zu behandeln und zu
                benutzen, wie es ein verständiger, auf die Werterhaltung bedachter Eigentümer tun würde.
                Insbesondere ist der Mieter auf seine Kosten verpflichtet:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>
                  Das Fahrzeug bei extremen Wetterbedingungen (z. B. Hagel, Sturm, Überschwemmung, starker
                  Schneefall) entsprechend gegen Beschädigungen zu sichern;
                </li>
                <li>
                  Das Fahrzeug bei Besorgnis der Beschädigung durch Vandalismus auf eigene Kosten entsprechend
                  zu sichern, zum Beispiel durch Abstellen in einer gesicherten Garage;
                </li>
                <li>
                  Signalisieren die Kontrollleuchten im Fahrzeug (z. B. für Ölstand/Öldruck, Wasser,
                  Temperatur, Bremsenverschleiß oder Sonstiges) ein Problem, so ist der Mieter verpflichtet,
                  sich entsprechend den in der Betriebsanleitung des Herstellers für das Fahrzeug dafür
                  vorgegebenen Hinweisen zu verhalten;
                </li>
                <li>
                  Den Ölstand des Motors und der Nebenaggregate sowie den Reifendruck vor jedem Antritt einer
                  längeren Fahrt zu prüfen und ggf. entsprechend den Vorgaben des Herstellers
                  richtigzustellen.
                </li>
              </ul>
              <p>
                Der Mieter hat im Rahmen seiner gegenüber dem Vermieter bestehenden allgemeinen Fürsorge- und
                Sorgfaltspflichten für das gemietete Fahrzeug auch das Verschulden von seinen Beifahrern und
                Mitreisenden zu vertreten. Beifahrer und Mitreisender ist jeder, der sich mit Wissen und im
                Einverständnis mit dem Mieter im oder am Fahrzeug befindet.
              </p>
              <p>
                Der Mieter haftet für alle Vermögensschäden des Vermieters, die aufgrund einer schuldhaften
                Verletzung seiner allgemeinen und nach diesem Mietvertrag bestehenden Fürsorgepflichten
                entstehen, im gesetzlichen Umfang.
              </p>
              <p>
                Der Vermieter ist bei Versicherungsfällen verpflichtet, zunächst die Fahrzeugvoll- oder
                Fahrzeugteilversicherung (Voll- oder Teilkaskoversicherung) in Anspruch zu nehmen. Leistungen
                der Versicherung mindern die Schadensersatzpflicht des Mieters.
              </p>
              <p>
                Nimmt der Vermieter die Reparatur eines Schadens selbst oder durch eigene Mitarbeiter vor, so
                wird hiermit ein Stundensatz je geleistete Arbeitsstunde und Person in Höhe von 45,00 € netto
                als angemessene Ersatzleistung vereinbart.
              </p>
            </Section>

            <Section title="Nicht unfallbedingte Fahrzeugschäden und technische Defekte">
              <p>
                Der Mieter haftet für alle Schäden am Fahrzeug, die auf Bedienungsfehler während der Mietzeit
                zurückzuführen sind, im gesetzlichen Umfang.
              </p>
              <p>
                Treten nach der Übergabe des Fahrzeugs an den Mieter nicht unfallbedingte technische Defekte
                am Fahrzeug auf, die die Gebrauchstauglichkeit wesentlich einschränken, sind beide Parteien
                berechtigt, den Vertrag mit sofortiger Wirkung fristlos zu kündigen, sofern es nicht möglich
                ist, den Defekt durch eine Reparatur kurzfristig zu beheben.
              </p>
              <p>
                Der Mieter verzichtet auch im Falle einer Kündigung auf alle weitergehenden Ansprüche, es sei
                denn, für den technischen Defekt ist ein grob fahrlässiges oder vorsätzliches Verhalten des
                Vermieters ursächlich.
              </p>
              <p>
                Endet der Vertrag aufgrund einer fristlosen Kündigung, so bleibt der Mieter zur Zahlung der
                vereinbarten Miete bis zum Zeitpunkt der Kündigung verpflichtet. Auf alle etwa bestehenden
                weitergehenden Ansprüche, insbesondere Schadensersatz einschließlich Ersatz von
                Mangelfolgeschäden, verzichtet der Mieter. Dieser Verzicht gilt nicht, wenn der Defekt vom
                Vermieter grob fahrlässig oder vorsätzlich zu vertreten ist.
              </p>
              <p>
                Der Mieter hat dem Vermieter einen etwaigen technischen Defekt des Fahrzeugs unverzüglich
                anzuzeigen. Unterbleibt eine Anzeige, hat der Mieter dem Vermieter den daraus entstehenden
                Schaden zu ersetzen.
              </p>
            </Section>

            <Section title="Verkehrsunfälle, Haftungsbeschränkung des Mieters">
              <p>
                Der Vermieter haftet nicht für Gegenstände, die vom Mieter in das Fahrzeug eingebracht wurden,
                wie bspw. Reisegepäck, Kameras oder Fahrräder. Bei Verkehrsunfällen ist der Vermieter
                verpflichtet, dem Mieter alle zur Durchsetzung seiner eigenen Schadensersatz- oder
                Schmerzensgeldansprüche gegenüber Unfallgegnern erforderlichen Daten in Textform mitzuteilen,
                dies gilt auch für entsprechende Ansprüche seiner Beifahrer und Mitreisenden.
              </p>
              <p>
                Im Falle eines Verkehrsunfalles, sofern es sich nicht nur um einen Bagatellunfall handelt,
                durch den die Gebrauchstauglichkeit des Fahrzeugs nicht wesentlich eingeschränkt ist, sind
                beide Parteien berechtigt, den Vertrag mit sofortiger Wirkung fristlos zu kündigen. Der Mieter
                bleibt auch in diesem Fall zur Zahlung der vereinbarten Miete bis zum Zeitpunkt der Kündigung
                verpflichtet.
              </p>
              <p>
                Bei Verkehrsunfällen (auch ohne Fremdbeteiligung), Brand, Wildschaden und sonstigen Schäden
                hat der Mieter unverzüglich die örtliche Polizei hinzuzuziehen und für die Aufnahme des
                Unfall- bzw. Schadenhergangs zu sorgen, den Vermieter zu benachrichtigen, dem Vermieter einen
                ausführlichen Unfallbericht mit beigefügter Unfallskizze zukommen zu lassen; bei Unfällen mit
                Fremdbeteiligung sind die Kennzeichen der beteiligten Fahrzeuge und deren
                Haftpflichtversicherungen sowie Namen und Anschriften der Fahrer und Zeugen festzuhalten.
              </p>
              <p>
                Bei allen Verkehrsunfällen haftet der Mieter – sofern ihm keine Obliegenheitsverletzung
                vorzuwerfen ist – für sämtliche Kosten, die durch eine fachgerechte Reparatur des Fahrzeugs
                (oder bei Totalschäden für die Kosten der Wiederbeschaffung) dem Vermieter entstehen, für
                andere Schäden haftet der Mieter nicht. <strong>Keine Haftung des Mieters</strong> besteht
                auch insoweit, als der Vermieter Schadensersatz von Unfallbeteiligten oder deren
                Versicherungen oder der für das Fahrzeug bestehenden Fahrzeugvoll- oder
                Fahrzeugteilversicherung erhält. In Höhe der mit der Versicherung vereinbarten
                Selbstbeteiligung ist ein Schaden aber regelmäßig durch Versicherungsleistungen{" "}
                <strong>nicht gedeckt</strong> und dann vom Mieter zu begleichen.
              </p>
              <p>
                Führt das Verhalten des Mieters nach einem Verkehrsunfall (beispielsweise Unfallflucht) oder
                das Verhalten des Mieters, welches für den Verkehrsunfall ursächlich war, ein Verstoß gegen
                die Nutzungsverbote oder eine sonstige Obliegenheitsverletzung des Mieters dazu, dass sich die
                für das Fahrzeug bestehende Fahrzeugvoll- oder Fahrzeugteilversicherung ganz oder teilweise
                auf Leistungsfreiheit nach den Vorschriften des Versicherungsvertragsgesetzes (VVG) gegenüber
                dem Vermieter berufen kann, haftet der Mieter für alle Vermögensschäden des Vermieters im
                gesetzlichen Umfang, soweit diese nicht durch eine Versicherungsleistung gedeckt sind. Die
                Vollkaskoversicherung kann sich beispielsweise auf Leistungsfreiheit berufen, wenn der Mieter
                das Fahrzeug unter Einfluss von alkoholischen oder sonstigen berauschenden Mitteln führt oder
                Unfallflucht begeht.
              </p>
              <p>
                Mit Wirkung ab dem Zeitpunkt der Befriedigung sämtlicher Schadensersatzansprüche des
                Vermieters durch den Mieter tritt der Vermieter alle ihm möglicherweise gegenüber dritten
                Personen zustehenden Schadensersatzansprüche zum Zwecke der Geltendmachung an den Mieter ab.
              </p>
            </Section>

            <Section title="Fürsorgepflicht und Haftung des Vermieters">
              <p>
                Der Vermieter kann die Leistung verweigern, soweit diese für den Vermieter unmöglich ist. Dies
                ist insbesondere dann der Fall, wenn das Fahrzeug vor Beginn der Mietzeit durch einen
                Verkehrsunfall oder infolge höherer Gewalt bei Naturereignissen so beschädigt wurde, dass es
                nicht mehr gebrauchstauglich ist, und eine Reparatur oder Ersatzbeschaffung vor Beginn der
                Mietzeit nicht mehr möglich war oder einen unverhältnismäßigen Aufwand erfordert hätte.
              </p>
              <p>
                Der Vermieter kann die Leistung auch verweigern, wenn er keinen Versicherungsschutz durch eine
                Fahrzeugvollversicherung zu wirtschaftlich zumutbaren Bedingungen erreichen kann.
              </p>
              <p>
                Im Fall einer Nichtleistung sind Schadensersatzansprüche gegenüber dem Vermieter – gleich aus
                welchem Rechtsgrund – ausgeschlossen. Der Vermieter ist jedoch verpflichtet, alle erhaltenen
                Zahlungen an den Mieter umgehend zurückzuzahlen.
              </p>
              <p>
                Der Vermieter übernimmt keine Gewähr für die Eignung des Fahrzeugs zu dem vom Mieter
                vorgesehenen Zweck.
              </p>
              <p>
                Die verschuldensunabhängige Haftung des Vermieters ist ausgeschlossen. Der Vermieter haftet
                nur für Vorsatz und grobe Fahrlässigkeit, für leichte Fahrlässigkeit nur bei der Verletzung
                wesentlicher Vertragspflichten. Diese Haftungsbeschränkungen gelten nicht bei der Verletzung
                des Körpers, des Lebens oder der Gesundheit und nicht im Fall des arglistigen Verschweigens
                von Mängeln des Fahrzeugs. Diese Haftungsbeschränkung gilt entsprechend für alle nach
                Vertragsschluss oder nach Überlassung des Fahrzeugs entstandenen Mängel des Fahrzeugs oder
                sonstige Schäden.
              </p>
            </Section>

            <Section title="Verlust von Schlüsseln oder Fahrzeugpapieren">
              <p>
                Sofern der Mieter den Verlust von Fahrzeugpapieren oder eines Schlüssels zu vertreten hat, ist
                er verpflichtet, die Kosten der Ersatzbeschaffung zu tragen sowie den damit verbundenen Zeit-
                und sonstigen Aufwand des Vermieters zu entschädigen. Der Zeitaufwand des Vermieters ist dabei
                in Höhe von 45,00 € netto je Stunde zu entschädigen.
              </p>
            </Section>

            <Section title="Beschädigung / Reparaturen">
              <p>
                Sollten Beschädigungen oder Reparaturen erforderlich sein, so wird die benötigte Arbeitszeit
                für die Recherche sowie die Aufwendungen mit einem Stundensatz von 45,00 € zuzüglich der
                gesetzlichen Mehrwertsteuer in Rechnung gestellt. Für jede Aufwendung, die dem Vermieter für
                eine Reparatur oder Beschädigung entsteht, wird ein Mindestbetrag von 49 € zuzüglich aller
                weiteren Kosten in Rechnung gestellt.
              </p>
            </Section>

            <Section title="Weitervermietung">
              <p>
                Sollte durch eine Beschädigung/Reparatur die nächsten gebuchten Vermietungen nicht möglich
                sein (Lieferzeit von Ersatzteilen bzw. Wartezeiten für Werkstatttermine), so verpflichtet sich
                der Mieter, die Kosten für alle weiteren Buchungen, bis das Fahrzeug wieder betriebsbereit
                ist, in der jeweiligen Höhe der Folgebuchungen zu übernehmen. Sollten durch den Folgemieter
                Ersatzmaßnahmen vorgenommen werden und diese dem Vermieter in Rechnung gestellt werden, ist
                der Vermieter berechtigt, die Kosten in voller Höhe an den Mieter weiterzugeben. Sollte die
                hinterlegte Kaution hierfür nicht ausreichend sein, so werden die weiteren Kosten in Rechnung
                gestellt.
              </p>
            </Section>

            <Section title="Technische und optische Veränderungen">
              <p>Der Mieter darf an dem Fahrzeug keine technischen Veränderungen vornehmen.</p>
              <p>
                Der Mieter ist nicht dazu befugt, das Fahrzeug optisch zu verändern; dazu zählen insbesondere
                Lackierungen, Aufkleber oder Klebefolien.
              </p>
            </Section>

            <Section title="Rechtswahl, Gerichtsstand, Sonstiges">
              <p>
                Die Einhaltung der Straßenverkehrsgesetze beim Betrieb des Fahrzeugs und der Teilnahme am
                öffentlichen Straßenverkehr im In- und Ausland ist ausschließlich Sache des Mieters.
              </p>
              <p>
                Die Parteien vereinbaren die Geltung von deutschem Recht für ihre gegenseitigen rechtlichen
                Beziehungen aus diesem Mietvertrag.
              </p>
              <p>
                Für den Fall, dass der Mieter keinen allgemeinen Gerichtsstand in Deutschland hat, vereinbaren
                die Parteien die Zuständigkeit deutscher Gerichte für die Entscheidung über
                Rechtsstreitigkeiten, die aufgrund dieses Mietvertrages bzw. Mietverhältnisses entstehen
                könnten. Zuständig soll dabei das Gericht sein, bei dem der Vermieter seinen allgemeinen
                Gerichtsstand hat, sofern nicht das Amtsgericht ausschließlich zuständig ist, in dem sich das
                vermietete Mietobjekt befindet.
              </p>
              <p>
                Wenn und soweit eine der Bestimmungen dieses Vertrages gegen eine zwingende gesetzliche
                Vorschrift verstößt, tritt an ihre Stelle die entsprechende gesetzliche Regelung.
              </p>
            </Section>

            <p className="pt-6 text-muted-foreground border-t border-border/30">
              Mit der Unterzeichnung des Mietvertrages bestätigt der Mieter, die vorstehenden allgemeinen
              Mietbedingungen zur Kenntnis genommen zu haben.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default AGB;
