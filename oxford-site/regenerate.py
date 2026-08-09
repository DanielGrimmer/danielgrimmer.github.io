#!/usr/bin/env python3
"""Regenerate the Oxford (users.ox.ac.uk/~pemb6003) mirror pages.

Run from the repo root:  python3 oxford-site/regenerate.py

Content is hard-coded here rather than parsed out of _pages/ — the two sites
have different structures, so when you change the Jekyll site you must edit
this file too if the mirror should follow. Keeps the old site's look and its
own asset paths (TalksAndPosters/, CVGrimmer.pdf, DGrimmer2.jpg,
DGrimmer3.jpg)."""
import io, os, html

OUT = "/home/user/danielgrimmer.github.io/oxford-site"
NEW = "https://danielgrimmer.github.io"

STYLE = """  <style>
  header {
    padding: 1em;
    clear: left;
    text-align: center;
    }
  hr {
    color: #002147;
    background: #002147;
    text-align: center;
    min-height: 0px;
    border-left: 0px;
    border-right: 0px;
    border-top: 1px solid #002147;
    border-bottom: 1px solid #002147;
    }
  a {
    color: #222222;
    }
  a:hover {
    color: #002147;
    }
  div.outerdiv {
    width: 75%;
    height: auto;
    margin: auto;
    clear: both;
    max-width: 950px;
    min-width: 250px;
    }
  div.innerdiv {
    width: 95%;
    height: auto;
    margin: 5px auto;
    position: relative;
    clear: both;
    margin-bottom: 36px;
    }
  div.topofpage {
    margin-top: 5px;
    }
  body {
    -webkit-text-size-adjust: 100%;
    font-family: 'Raleway', sans-serif;
    background-color: #F7F7F7;
    color: #222222;
    padding-bottom: 75px;
    line-height: 1.6;
    }
  h2 {
    font-family: 'Buenard', serif;
    color: #002147;
    text-align: left;
    }
  table.entry {
    width: 95%;
    margin-left: 30px;
    margin-bottom: 18px;
    border-collapse: collapse;
    }
  td.right {
    text-align: right;
    white-space: nowrap;
    padding-left: 12px;
    }
  p.body {
    text-align: left;
    margin-left: 30px;
    max-width: 800px;
    }
  </style>"""

NAV = """    <div class="headerlinks" style="text-align:center;">
      <b>
        <a href="index.html">Home</a>&nbsp;&nbsp;&nbsp;&nbsp;
        &nbsp;&nbsp;<a href="papers.html">Publications</a>&nbsp;&nbsp;&nbsp;&nbsp;
        &nbsp;&nbsp;<a href="talks.html">Talks and Conference Presentations</a>&nbsp;&nbsp;&nbsp;&nbsp;
        &nbsp;&nbsp;<a href="teaching.html">Teaching</a>&nbsp;&nbsp;&nbsp;&nbsp;
        &nbsp;&nbsp;<a href="about.html">About</a>&nbsp;&nbsp;&nbsp;&nbsp;
        &nbsp;&nbsp;<a href="SoccerHockey/SoccerHockeyDemoV3.1.html">Soccer Hockey Duality</a>&nbsp;&nbsp;&nbsp;&nbsp;
        &nbsp;&nbsp;<a href="EscherChess/EscherChessDemoV1.2.html">Escher Chess</a>&nbsp;&nbsp;&nbsp;&nbsp;
      </b>
    </div>"""


def page(canonical, body):
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Daniel Grimmer</title>
  <!-- This page mirrors {NEW} , which is the primary site. -->
  <link rel="canonical" href="{canonical}">
{STYLE}
  <link href="https://fonts.googleapis.com/css?family=Buenard|Raleway" rel="stylesheet">
</head>
<body>
  <div class="outerdiv">

    <!-- NAVIGATION AND HEADER -->
    <div class="topofpage">
      <header>
        <h1 style="font-family: 'Buenard', serif; text-align: center; color:#002147;"> Daniel Grimmer </h1>
        <p style="text-align: center;"><strong>Postdoctoral Associate in Philosophy, Yale University</strong></p>
        <p style="text-align: center;">
          <a href="CVGrimmer.pdf" target="_blank">Long CV</a> |
          <a href="https://github.com/DanielGrimmer" target="_blank">GitHub</a> |
          <a href="https://www.youtube.com/@oxfordspacetime" target="_blank">YouTube</a> |
          <a href="https://orcid.org/0000-0002-8449-3775" target="_blank">ORCID</a>
          <br>
          Email: daniel.grimmer(at)yale.edu
        </p>
      </header>
      <hr style="width: 100%">
{NAV}
      <hr style="width: 100%">
    </div>

    <!-- MAIN CONTENT -->
    <div class="innerdiv">
{body}
    </div>
  </div>
</body>
</html>
"""


def entry(title, meta, right_top="", right_bot=""):
    """One publication/talk block, in the old site's two-column table style."""
    rt = f'<td class="right">{right_top}</td>' if right_top else '<td class="right"></td>'
    rb = f'<td class="right">{right_bot}</td>' if right_bot else '<td class="right"></td>'
    return f"""      <table class="entry">
        <tbody>
          <tr>
            <td><strong>{title}</strong></td>
            {rt}
          </tr>
          <tr>
            <td>{meta}</td>
            {rb}
          </tr>
        </tbody>
      </table>
"""


def a(url, text):
    return f'<a href="{url}" target="_blank">{text}</a>'


# --------------------------------------------------------------------------
# index.html
# --------------------------------------------------------------------------
selected = (
    entry("Direct From Darwin: Deriving Advanced Optimizers From Evolutionary First Principles",
          "Daniel Grimmer.",
          a("https://arxiv.org/abs/2605.05284", "(arXiv)"),
          a("https://github.com/DanielGrimmer/adam-dls", "(GitHub Repo)")) +
    entry("Innateness In Silico at Scale: How Evolutionary Meta-Learning Repositions Neural Networks within the Nativism&ndash;Empiricism Debate",
          "Daniel Grimmer.",
          a("https://philsci-archive.pitt.edu/28373/", "PhilSci Archive")) +
    entry("Dualities, Quantum Mechanics, and the Uncommon Common Core",
          "Daniel Grimmer, Enrico Cinti, Rasmus Jaksland.",
          a("https://www.journals.uchicago.edu/doi/10.1086/730421", "BJPS")) +
    entry("The Pragmatic QFT Measurement Problem and the Need for a Heisenberg-like Cut in QFT",
          "Daniel Grimmer.",
          a("https://link.springer.com/article/10.1007/s11229-023-04301-4", "Synthese") + " | " +
          a("https://arxiv.org/abs/2205.09608", "(arXiv)"),
          a("https://www.youtube.com/watch?v=T2Xv6EYnrGE", "(Vid.Abs.)"))
)

index_body = f"""      <h2>About Me</h2>
      <img src="DGrimmer3.jpg" alt="Daniel Grimmer" style="float: right; margin: 0px 15px 15px 15px; max-width: 220px; border-radius: 8px;">
      <p class="body">
        I am a Postdoctoral Associate in Philosophy at Yale University. My research trajectory spans across
        disciplines, beginning with Physics (Ph.D., Waterloo) and expanding into the Philosophy of Physics
        (DPhil, Oxford), Cognitive Science, and Artificial Intelligence.
      </p>
      <p class="body">
        Currently, my work focuses on <strong>Evolutionary Epistemology <i>in silico</i></strong>
        {a("https://www.youtube.com/playlist?list=PLrJKZOWDalkVMqSXykVyW3GQY5OzeL2iu", "(Recent Talk)")}.
        Remarkably, the machine learning technique of Meta-Learning can be used to implement an evolutionarily
        faithful simulation of Darwinian evolution. We can therefore use artificial neural networks to simulate
        the evolution of our own cognitive faculties, shedding light on the age-old philosophical debate between
        Nativism and Empiricism. In aid of this program, I have recently derived a suite of advanced optimization
        algorithms directly from evolutionary first principles
        {a("https://arxiv.org/abs/2605.05284", "(Recent Paper)")}.
      </p>

      <hr>

      <h2>Primary Research Interests</h2>
      <div style="margin-left: 30px; text-align: left; max-width: 800px;">
        <br>
        1. <b>Artificial Intelligence &amp; Evolutionary Epistemology:</b> The dominant training regime for
        neural networks is broadly Empiricist: beginning effectively <i>tabula rasa</i> (i.e., random weights
        and biases) general-purpose methods (e.g., statistics and associations) are then applied to massive
        amounts of data. Rejecting hand-coded innate structures, the Bitter Lesson says: scale, scale, scale!
        But meta-learning (understood as a simulation of Darwinian evolution) allows for <i>Scalable Nativism</i>
        ({a("https://philsci-archive.pitt.edu/28373/", "see this paper")}). In principle, we can redeploy these
        (formerly) empiricist methods to nativist ends. Concretely, we can evolve a wide range of different
        innate structures within neural networks, everything from Kant's categories, to Jung's archetypes, and
        Chomsky's Universal Grammar.<br>
        <br>
        2. <b>Metaphysics of Space and Time:</b> What if we could remove and replace the topological
        underpinnings of our spacetime theories just as easily as we can switch between different coordinate
        systems? I claim that we can by using the ISE Method of topological redescription which I developed in
        my DPhil thesis. (See {a("https://www.youtube.com/watch?v=prX1KTB1Jl0", "this video")} and
        {a("https://arxiv.org/abs/2306.08110", "this paper")}.) I claim that these new topological redescription
        techniques lead us to a conventionalist/neo-Kantian view of spacetime topology which I call the
        <i>Dynamics-First View of Spacetime Topology</i>
        ({a("https://arxiv.org/abs/2308.14146", "see this paper")}). For instance, in cases of
        spacetime-dualities (e.g., AdS-CFT) two different species might evolve radically different spatial
        intuitions and, relatedly, different ontologies/mereologies. Who then is right about the world's
        fundamental metaphysics?<br>
        <br>
        3. <b>Measurement in Quantum Field Theory (QFT):</b> How should we model quantum measurement processes
        which involve quantum fields? How must our characterization of QFT's observables differ from how we
        characterize the observables of non-relativistic quantum mechanics (NRQM)? Can we model QFT-involved
        measurement using PVMs and POVMs as we are used to in NRQM? Perhaps surprisingly, we cannot. This gives
        rise to what I call the <i>Pragmatic QFT Measurement Problem</i>
        ({a("https://arxiv.org/abs/2205.09608", "Paper")},
        {a("https://www.youtube.com/watch?v=T2Xv6EYnrGE", "Video Abstract")}).<br>
      </div>

      <hr>

      <h2>Selected Papers</h2>
{selected}
      <p style="text-align: center;"><a href="papers.html">View All Publications</a></p>

      <hr>
"""

# --------------------------------------------------------------------------
# about.html
# --------------------------------------------------------------------------
about_body = f"""      <img style="width: 35%; min-width: 200px; max-width: 350px; float: right; margin-left: 20px; border-radius: 8px;" src="DGrimmer2.jpg" alt="Daniel Grimmer">

      <p class="body">
        I am currently a Postdoctoral Associate in Philosophy at Yale University. My research trajectory is
        highly interdisciplinary, reflecting a continuous drive to use rigorous formal methods to answer
        fundamental philosophical questions. Today, this takes the form of <strong>Evolutionary Epistemology
        <i>in silico</i></strong>, where I use the machine learning technique of Evolutionary Meta-Learning to
        formally simulate Darwinian evolution and probe classical debates in cognitive science, such as
        Nativism vs. Empiricism.
      </p>

      <p class="body">
        Before coming to Yale, I was a Hertz Postdoctoral Fellow in the History and Philosophy of Physics at the
        University of Bonn. Prior to that, I completed a DPhil (Ph.D.) in Philosophy at the University of
        Oxford, supported by a {a("https://www.ox.ac.uk/clarendon", "Clarendon scholarship")} at Reuben College.
        My DPhil thesis developed the ISE Method of topological redescription, arguing for a
        &ldquo;Dynamics-First&rdquo; view of spacetime topology.
      </p>

      <p class="body">
        Concurrently with my DPhil, I was a Visiting Postdoctoral Fellow at the
        {a("https://barrio-rqi.org/", "Barrio RQI")} research group, based primarily out of the University of
        Waterloo and the Perimeter Institute.
      </p>

      <p class="body">
        Prior to my DPhil, I completed Oxford's one-year MSt in Philosophy of Physics at Pembroke College&mdash;an
        excellent program for philosophically-minded physicists.
      </p>

      <p class="body">
        Before my transition into philosophy, I completed my Ph.D. in Physics (Quantum Information) at the
        {a("https://uwaterloo.ca/institute-for-quantum-computing/", "Institute for Quantum Computing (IQC)")}
        at the University of Waterloo. There, I worked with
        {a("https://uwaterloo.ca/applied-mathematics/people-profiles/eduardo-martin-martinez", "Eduardo Mart&iacute;n-Mart&iacute;nez")}
        ({a("https://barrio-rqi.org/", "Barrio RQI")}) and
        {a("https://uwaterloo.ca/physics-astronomy/people-profiles/robert-mann", "Robert B. Mann")}.
      </p>

      <p class="body">
        My physics {a("https://uwspace.uwaterloo.ca/handle/10012/16312", "Ph.D. thesis")}
        ({a("https://arxiv.org/abs/2009.10472", "arXiv")}) established the foundations of the Interpolated
        Collision Model formalism, a tool for studying the dynamics of open quantum systems undergoing generic
        repeated updates. This formalism has been applied to study
        {a("https://arxiv.org/abs/1611.07530", "purification")},
        {a("https://arxiv.org/abs/1805.11118", "thermalization")},
        {a("https://arxiv.org/abs/1902.07738", "friction")}, and the
        {a("https://arxiv.org/abs/2011.08223", "Unruh Effect")}.
      </p>
"""

io.makedirs = os.makedirs
os.makedirs(OUT, exist_ok=True)
io.open(os.path.join(OUT, "index.html"), "w", encoding="utf-8").write(page(f"{NEW}/", index_body))
io.open(os.path.join(OUT, "about.html"), "w", encoding="utf-8").write(page(f"{NEW}/about/", about_body))
print("wrote index.html, about.html")

# --------------------------------------------------------------------------
# papers.html
# --------------------------------------------------------------------------
def arx(i): return a(f"https://arxiv.org/abs/{i}", "(arXiv)")

under_review = (
    entry("Innateness In Silico at Scale: How Evolutionary Meta-Learning Repositions Neural Networks within the Nativism&ndash;Empiricism Debate",
          "Daniel Grimmer.",
          "Synthese (Submitted Mar 2026; Revise and Resubmit) | " +
          a("https://philsci-archive.pitt.edu/28373/", "(PhilSci Archive)")) +
    entry("Direct From Darwin: Deriving Advanced Optimizers From Evolutionary First Principles",
          "Daniel Grimmer.",
          "Evolutionary Computation (Submitted May 2026) | " + arx("2605.05284"),
          a("https://github.com/DanielGrimmer/adam-dls", "(GitHub Repo)"))
)

pubs = []
pubs.append(("2026", [
    entry("Equivalence and Determinism in Light of Topologically-Induced Structure",
          "Daniel Grimmer, James Read.",
          "Erkenntnis (Accepted Jul 2026; in production) | " +
          a("https://philsci-archive.pitt.edu/29119/", "(PhilSci Archive)")),
]))
pubs.append(("2024", [
    entry("Searching for New Spacetimes: Towards a Dynamics-First View of Topology",
          "Daniel Grimmer. <br> D.Phil. Thesis, University of Oxford (Submitted Jul 2024, Viva Aug 2024). Passed viva with no corrections.",
          "(Text Available Upon Request)"),
    entry("Dualities, Quantum Mechanics, and the Uncommon Common Core",
          "Daniel Grimmer, Enrico Cinti, Rasmus Jaksland.",
          a("https://www.journals.uchicago.edu/doi/10.1086/730421", "BJPS") + " (Mar 2024)"),
]))
pubs.append(("2023", [
    entry("The Pragmatic QFT Measurement Problem and the Need for a Heisenberg-like Cut in QFT",
          "Daniel Grimmer.",
          a("https://link.springer.com/article/10.1007/s11229-023-04301-4", "Synthese") +
          " 202, 104 (Sept 2023) | " + arx("2205.09608"),
          a("https://www.youtube.com/watch?v=T2Xv6EYnrGE", "(Vid.Abs.)")),
    entry("Decoding Quantum Field Theory with Machine Learning",
          "Daniel Grimmer, Irene Melgarejo-Lermas, Jos&eacute; Polo-G&oacute;mez, Eduardo Mart&iacute;n-Mart&iacute;nez.",
          a("https://link.springer.com/article/10.1007/JHEP08(2023)031", "JHEP") +
          " 2023, 031 (Aug 2023) | " + arx("1910.03637")),
]))
pubs.append(("2021", [
    entry("Measurements in QFT: Weakly Coupled Local Particle Detectors and Entanglement Harvesting",
          "Daniel Grimmer, Bruno de S. L. Torres, Eduardo Mart&iacute;n-Mart&iacute;nez.",
          a("https://journals.aps.org/prd/abstract/10.1103/PhysRevD.104.085014", "PRD") +
          " 104, 085014 (Oct 2021) | " + arx("2108.02794")),
    entry("The Unruh Effect in Slow Motion",
          "Silas Vriend, Daniel Grimmer, Eduardo Mart&iacute;n-Mart&iacute;nez.",
          a("https://www.mdpi.com/2073-8994/13/11/1977", "Symmetry") +
          " 13(11), 1977 (Oct 2021) | " + arx("2011.08223"),
          a("https://youtu.be/BkLmIObkg0c", "(Vid.Abs.)")),
    entry("Dimensional Reduction of Cavities with Axial Symmetry: Are Optical Fibers Really One-Dimensional?",
          "Daniel Grimmer, Richard Lopp, Eduardo Mart&iacute;n-Mart&iacute;nez.",
          a("https://journals.aps.org/pra/abstract/10.1103/PhysRevA.104.013723", "PRA") +
          " 104, 013723 (Jul 2021) | " + arx("2104.00745")),
]))
pubs.append(("2020", [
    entry("Interpolated Collision Models Formalism",
          "Daniel Grimmer. <br> Ph.D. Thesis in Physics, University of Waterloo (Sept 2020).",
          a("https://uwspace.uwaterloo.ca/handle/10012/16312", "UW Space") + " | " + arx("2009.10472")),
]))
pubs.append(("2019", [
    entry("Collisional Quantum Thermometry",
          "Stella Seah, Stefan Nimmrichter, Daniel Grimmer, Jader P. Santos, Valerio Scarani, Gabriel T. Landi.",
          a("https://journals.aps.org/prl/abstract/10.1103/PhysRevLett.123.180602", "PRL") +
          " 123, 180602 (Oct 2019) | " + arx("1904.12551")),
    entry("Zeno Friction and Antifriction from Quantum Collision Models",
          "Daniel Grimmer, Achim Kempf, Robert B. Mann, Eduardo Mart&iacute;n-Mart&iacute;nez.",
          a("https://journals.aps.org/pra/abstract/10.1103/PhysRevA.100.042702", "PRA") +
          " 100, 042702 (Oct 2019) | " + arx("1902.07738")),
    entry("A Classification of Markovian Fermionic Gaussian Master Equations",
          "Marvellous Onuma-Kalu, Daniel Grimmer, Robert B. Mann, Eduardo Mart&iacute;n-Mart&iacute;nez.",
          a("https://iopscience.iop.org/article/10.1088/1751-8121/ab40e1", "J Phys A") +
          " 52, 435302 (Oct 2019) | " + arx("1902.02239")),
    entry("Thermal Contact: Mischief and Time Scales",
          "Daniel Grimmer, Robert B. Mann, Eduardo Mart&iacute;n-Mart&iacute;nez.",
          a("https://iopscience.iop.org/article/10.1088/1751-8121/ab3a19", "J Phys A") +
          " 52, 395305 (Sept 2019) | " + arx("1805.11118")),
]))
pubs.append(("2018", [
    entry("Gaussian Ancillary Bombardment",
          "Daniel Grimmer, Eric Brown, Achim Kempf, Robert B. Mann, Eduardo Mart&iacute;n-Mart&iacute;nez.",
          a("https://journals.aps.org/pra/abstract/10.1103/PhysRevA.97.052120", "PRA") +
          " 97, 052120 (May 2018) | " + arx("1802.08629")),
    entry("A Classification of Open Gaussian Dynamics",
          "Daniel Grimmer, Eric Brown, Achim Kempf, Robert B. Mann, Eduardo Mart&iacute;n-Mart&iacute;nez.",
          a("https://iopscience.iop.org/article/10.1088/1751-8121/aac114", "J Phys A") +
          " 51, 245301 (May 2018) | " + arx("1709.07891")),
]))
pubs.append(("2017", [
    entry("Purification in Rapid Repeated Interaction Systems",
          "Daniel Grimmer, Robert B. Mann, Eduardo Mart&iacute;n-Mart&iacute;nez.",
          a("https://journals.aps.org/pra/abstract/10.1103/PhysRevA.95.042114", "PRA") +
          " 95, 042114 (Apr 2017) | " + arx("1611.07530")),
]))
pubs.append(("2016", [
    entry("Open Dynamics under Rapid Repeated Interaction",
          "Daniel Grimmer, David Layden, Robert B. Mann, Eduardo Mart&iacute;n-Mart&iacute;nez.",
          a("https://journals.aps.org/pra/abstract/10.1103/PhysRevA.94.032126", "PRA") +
          " 94, 032126 (Sept 2016) | " + arx("1605.04302")),
]))
pubs.append(("2014", [
    entry("Quantum Phases of Soft-Core Dipolar Bosons in Optical Lattices",
          "Daniel Grimmer, Arghavan Safavi-Naini, Barbara Capogrosso-Sansone, &#350;ebnem G&uuml;ne&#351; Soyler.",
          a("https://journals.aps.org/pra/abstract/10.1103/PhysRevA.90.043635", "PRA") +
          " 90, 043635 (Oct 2014) | " + arx("1408.3532")),
]))

peer_reviewed = ""
for year, items in pubs:
    peer_reviewed += f"      <p style=\"margin-left: 30px;\"><b>{year}</b></p>\n" + "".join(items)

preprints = (
    entry("Spacetime Representation Theory: Setting the Scope of the ISE Method of Topological Redescription",
          "Daniel Grimmer. <br> Withdrawn from review; reworked into <i>Das Neue Raumproblem</i> (Jun 2023).",
          arx("2306.08110"),
          a("https://www.youtube.com/watch?v=prX1KTB1Jl0", "(Video)")) +
    entry("From Humean Laws to a Neo-Kantian Spacetime: A Dynamics-First View of Topology",
          "Daniel Grimmer. <br> Preprint only (Aug 2023).", arx("2308.14146")) +
    entry("Introducing the ISE Methodology: A Powerful New Tool for Topological Redescription",
          "Daniel Grimmer. <br> Preprint only (Mar 2023).", arx("2303.04130")) +
    entry("A Discrete Analog of General Covariance, Part 2: Despite What You've Heard, a Perfectly Lorentzian Lattice Theory",
          "Daniel Grimmer. <br> Preprint only (May 2022).", arx("2205.07701")) +
    entry("A Discrete Analog of General Covariance, Part 1: Could the World Be Fundamentally Set on a Lattice?",
          "Daniel Grimmer. <br> Preprint only (Apr 2022).", arx("2204.02276"),
          a("https://youtu.be/dc58WyWX-z4", "(Video)"))
)

papers_body = f"""      <h2>Papers Currently Under Peer Review (2)</h2>
{under_review}
      <hr>

      <h2>Peer-Reviewed Publications and Graduate Theses (18)</h2>
{peer_reviewed}
      <hr>

      <h2>Unpublished Preprints (5)</h2>
{preprints}
"""

io.open(os.path.join(OUT, "papers.html"), "w", encoding="utf-8").write(
    page(f"{NEW}/publications/", papers_body))
print("wrote papers.html")

# --------------------------------------------------------------------------
# talks.html
# --------------------------------------------------------------------------
def talk(title, venue, right_top="", extra_rows=""):
    rt = f'<td class="right">{right_top}</td>' if right_top else '<td class="right"></td>'
    return f"""      <table class="entry">
        <tbody>
          <tr>
            <td><strong>{title}</strong></td>
            {rt}
          </tr>
          <tr>
            <td>{venue}</td>
            <td class="right"></td>
          </tr>
{extra_rows}        </tbody>
      </table>
"""

def vidrow(label, url):
    return f"""          <tr>
            <td></td>
            <td class="right">{a(url, label)}</td>
          </tr>
"""

def plain(venue):
    return f"""      <table class="entry">
        <tbody>
          <tr><td>{venue}</td></tr>
        </tbody>
      </table>
"""

SLIDES = "TalksAndPosters/"

upcoming = talk(
    "The Circularity Beneath Measurement: Felix Hausdorff and the Underdetermination of Geometry by Evidence",
    "American Philosophical Association, Eastern Division, Boston MA, USA",
    "January 13&ndash;16, 2027")

past = (
    talk("How Evolutionary Meta-Learning Repositions Neural Networks in the Nativism&ndash;Empiricism Debate",
         "British Society for the Philosophy of Science (BSPS), Leeds, UK", "July 2026") +
    talk("Topological Asymmetry Neutralizes Leibniz's Shift Argument and Collapses Categorical Equivalence",
         "Foundations of Physics, University of California, Irvine CA, USA", "June 2026") +
    talk("Hausdorff and the Underdetermination of Space by Evidence",
         "Felix Hausdorff Conference, Yale University, New Haven CT, USA", "May 2026") +
    talk("Evolutionary Epistemology In Silico: Exploring Nature and Nurture with Neural Networks",
         "Laurie Paul's Group Meeting, Yale University, New Haven CT, USA", "April 2026") +
    talk("Evolutionary Epistemology In Silico: Exploring Nature and Nurture with Neural Networks",
         "ELLMM Talk Series, Yale University, New Haven CT, USA", "April 2026") +
    talk("Evolutionary Meta-Learning: A New Framework for Linguistic Nativism",
         "Computational Linguistics at Yale (CLAY), New Haven CT, USA", "February 2026") +
    talk("The End of Nature vs. Nurture: Why AI Won't Inherit Our Philosophical Puzzles",
         "P&amp;P Meeting, Digital Ethics Center, Yale University, New Haven CT, USA", "September 2025") +
    talk("Undercutting the Spatiotemporal Underpinnings of the Humean Mosaic",
         "Quantum Gravity and the Laws of Nature Workshop, Geneva, Switzerland", "December 2024") +
    talk("Searching for New Spacetimes: The ISE Method of Topological Redescription",
         "History and Philosophy of Physics Research Seminar, University of Bonn, Germany", "November 2024") +
    talk("What Are the Laws of Nature? And What Do They Do?",
         "Surrey Summer School, Southampton, UK", "July 2024") +
    talk("In Search of New Spacetimes: The ISE Method of Topological Redescription",
         "Philosophy of Physics Seminar, University of Oxford, UK", "May 2024") +
    talk("In Search of New Spacetimes: A Dynamics-First View of Topology",
         "Job talks &mdash; Technion, University of Bonn, and Chapman University", "February 2024") +
    talk("In Search of New Spacetimes: A Dynamics-First View of Topology",
         "Philosophy of Physics Workshop, University of Oxford, UK", "September 2023") +
    talk("Deflating Spacetime: A Dynamics-First View of Topology",
         "Third Hermann Minkowski Meeting on the Foundations of Spacetime Physics, Albena, Bulgaria",
         "September 2023") +
    talk("From Humean Laws to a Neo-Kantian Spacetime: A Dynamics-First View of Topology",
         "First International Colloquium: 'Emergence and Time', Braga, Portugal", "September 2023") +
    talk("A Dynamics-First View of Topology: Topological Redescription via the ISE Methodology",
         "Foundations of Physics 2023, Bristol, UK", "July 2023") +
    talk("In Search of New Spacetimes: Spacetime Non-Fundamentality Even for Well-Established Physics",
         "Oxford practice job talk, Oxford, UK", "February 2023") +
    talk("Deflating Spacetime: A Dynamics-First View of the Spacetime Manifold",
         "Barrio RQI, Waterloo ON, Canada", "January 2023") +
    talk("Deflating Spacetime: A Dynamics-First View of the Spacetime Manifold",
         "DPhil Seminar, Oxford, UK", "November 2022") +
    talk("Regularity Relationism without a Manifold",
         "Philosophy of Logic, Mathematics and Physics Graduate Conference (LMP 2022), London ON, Canada",
         "June 12, 2022") +
    talk("The Pragmatic QFT Measurement Problem and the Need for a Heisenberg-like Cut in QFT",
         "Quantum Field Theory on Curved Spacetime 2022, Online", "May 2022",
         vidrow("Video", "https://www.youtube.com/watch?v=itEa5PmbWJE")) +
    talk("The Pragmatic QFT Measurement Problem Requires a Heisenberg-like Cut in QFT",
         "Establishing the Philosophy of Supersymmetry 2022, Stockholm, Sweden", "May 2022") +
    talk("Two Discrete Analogs of General Covariance: Could the world be fundamentally set on a lattice?",
         "Barrio RQI, Waterloo ON, Canada", "April 20, 2022") +
    talk("A Discrete Analog of General Covariance: Could the world be fundamentally set on a lattice?",
         "Irvine&ndash;London&ndash;Munich&ndash;PoliMi&ndash;Salzburg Conference (ILMPS 2022), Milan, Italy",
         "April 6, 2022", vidrow("Video", "https://youtu.be/Zpdcy40W49Y")) +
    talk("The Pragmatic QFT Measurement Problem: A Tale of Two Detector Models",
         "Philosophy of Physics Graduate Lunch, Oxford, UK", "February 10, 2022",
         vidrow("Slides", SLIDES + "PragmaticQFTMeasurementProblemPopGrunch.pdf") +
         vidrow("Video Part 1", "https://youtu.be/evYAwvnYf2E") +
         vidrow("Video Part 2", "https://youtu.be/Trguaf4P9X8") +
         vidrow("Video Part 3", "https://youtu.be/R-egyJUVTTY") +
         vidrow("Video Part 4", "https://youtu.be/58qLS1yqyYE") +
         vidrow("Video Part 5", "https://youtu.be/xf4qyBvqVeM")) +
    talk("Window to the World: America",
         "Heidelberg Laureate Forum 2021 (Online)", "September 22, 2021") +
    talk("The Unruh Effect in Slow Motion",
         "RQI-Online Conference 2021, Waterloo ON, Canada", "March 10, 2021",
         vidrow("Slides", SLIDES + "TheUnruhEffectInSlowMotion.pdf") +
         vidrow("Video Talk", "https://youtu.be/LL5lDEByuMo") +
         vidrow("Video Abstract", "https://youtu.be/BkLmIObkg0c")) +
    talk("A Discrete Analog of General Covariance",
         "Philosophy of Physics Graduate Lunch, Oxford, UK", "January 22, 2021",
         vidrow("Slides", SLIDES + "DiscreteGeneralCovariancePopGrunch.pdf") +
         vidrow("Video Part 1", "https://youtu.be/1hK5JlPWfpI") +
         vidrow("Video Part 2", "https://youtu.be/2Q0oyRZ5eY4") +
         vidrow("Video Part 3", "https://youtu.be/WyJcBuZchHM") +
         vidrow("Video Part 4", "https://youtu.be/Ubyc2D6F0ic")) +
    talk("Discrete General Covariance",
         "Barrio RQI, Waterloo ON, Canada", "January 13, 2021",
         vidrow("Slides", SLIDES + "DiscreteGeneralCovarianceBarrioRQI.pdf") +
         vidrow("Video Part 1", "https://www.youtube.com/watch?v=t7B4i8ipmLA") +
         vidrow("Video Part 2", "https://www.youtube.com/watch?v=gyFE0bTTIjQ") +
         vidrow("Video Part 3", "https://www.youtube.com/watch?v=URug4ascQAA")) +
    "".join(plain(v) for v in [
        "National University of Singapore, March 2019",
        "RQI-South, Brisbane, Australia, February 2019",
        "CAP 2018, Halifax NS, Canada, June 2018",
        "Probing the Spacetime Fabric 2017, Trieste, Italy, July 2017",
        "RQI-North 2017, Kyoto, Japan, July 2017",
        "Spacetime and Information Workshop 2017, Manitoulin ON, Canada, June 2017",
        "CAP 2017, Kingston ON, Canada, May 2017",
        "CAP 2016, Ottawa ON, Canada, June 2016",
        "RQI-North 2016, Waterloo ON, Canada, June 2016",
        "OSU AMO Research Day, Stillwater OK, USA, July 2013",
        "DAMOP Physics Conference, Quebec City QC, Canada, June 2013",
    ])
)

posters = "".join(plain(v) for v in [
    "Heidelberg Laureate Forum (Virtual), September 2020",
    "Vienna Summer School 2020 on Gravitational Quantum Physics (Virtual), September 2020",
    "Engineered Quantum Systems School, Helsinki, Finland, June 2019",
    "Quantum Thermodynamics 2019, Espoo, Finland, June 2019",
    "Canadian Graduate Quantum Conference 2019, Jouvence QC, Canada, June 2019",
    "Quantum Thermodynamics 2018, Santa Barbara CA, USA, June 2018",
    "Canadian Graduate Quantum Conference 2018, Vancouver BC, Canada, June 2018",
    "Theory Canada 2018, Antigonish NS, Canada, June 2018",
    "Theory Canada 11, Ottawa ON, Canada, June 2016",
])

visits = "".join(plain(v) for v in [
    "National University of Singapore, March 2019",
    "S&atilde;o Carlos, Brazil, June 2013",
])

talks_body = f"""      <h2>Upcoming Conference Talks</h2>
{upcoming}
      <hr>

      <h2>Past Talks</h2>
{past}
      <hr>

      <h2>Past Posters</h2>
{posters}
      <hr>

      <h2>Past Research Visits</h2>
{visits}"""

io.open(os.path.join(OUT, "talks.html"), "w", encoding="utf-8").write(page(f"{NEW}/talks/", talks_body))
print("wrote talks.html")

# --------------------------------------------------------------------------
# teaching.html
# --------------------------------------------------------------------------
def course(title, where):
    return f"""      <table class="entry">
        <tbody>
          <tr><td><strong>{title}</strong></td></tr>
          <tr><td>{where}</td></tr>
        </tbody>
      </table>
"""

teaching_body = f"""      <h2>Yale Teaching</h2>
{course("Philosophy of Physics: Space, Time, and Quantum (PHIL 3333)", "Yale Philosophy Department, Fall 2026")}
{course("First Order Logic (PHIL 1115)", "Yale Philosophy Department, Fall 2026")}
{course("AI Epistemology and Ethics: Knowing Machine Morals (PHIL 2340)", "Yale Philosophy Department, Fall 2025")}
{course("First Order Logic (PHIL 1115)", "Yale Philosophy Department, Fall 2025")}
      <hr>

      <h2>Special Seminar Series</h2>
{course("Metaphysics of the Laws of Nature", "Oxford Michaelmas Term 2023, Philosophy Faculty")}
      <hr>

      <h2>Oxford Teaching Assistantships</h2>
{course("General Philosophy", "Oxford Hilary Term 2023, Oriel College")}
{course("General Philosophy", "Oxford Michaelmas Term 2022 &ndash; Hilary Term 2023, St Hugh's College")}
      <hr>

      <h2>Oxford Tutorial Teaching</h2>
{course("Philosophy of Time", "Oxford Trinity Term 2023, Pembroke College (OxNet Outreach)")}
{course("Leibniz&ndash;Clarke Correspondence", "Oxford Trinity Term 2023, Magdalen College")}
{course("Philosophy of Mathematics", "Oxford Trinity Term 2023, Brasenose College")}
{course("Elements of Deductive Logic", "Oxford Hilary Term 2023, St Hugh's College")}
{course("Philosophy of Spacetime", "Oxford Michaelmas Term 2022, Wycliffe Hall")}
{course("Philosophy of Science", "Oxford Hilary Term 2022, St Catherine's College")}
{course("Philosophy of Science", "Oxford Hilary Term 2022, St Hilda's College")}
{course("Introduction to Logic", "Oxford Hilary Term 2022, Oxford Study Abroad Programme")}
{course("Philosophy of Time", "Oxford Hilary Term 2022, Oriel College (Academic Taster)")}
{course("Philosophy of Spacetime", "Oxford Hilary Term 2022, Exeter College")}
{course("Elements of Deductive Logic", "Oxford Hilary Term 2022, Pembroke College")}
{course("Introduction to Logic", "Oxford Michaelmas Term 2021, Pembroke College")}
      <hr>

      <h2>Teaching Experience Prior to Oxford</h2>
{course("Teaching Assistant in Physics", "University of Waterloo, Sept 2015 &ndash; Dec 2017<br>Physics 1 &middot; Mechanics &middot; Electrical Engineering 1 &middot; Quantum Physics 1 &middot; Quantum Theory 2")}
{course("Mathematics Tutor", "University of Oklahoma, Sept 2013 &ndash; May 2015")}
{course("Children's Mathematics Tutor", "Mathnasium OKC, May 2014 &ndash; July 2014")}
"""

io.open(os.path.join(OUT, "teaching.html"), "w", encoding="utf-8").write(
    page(f"{NEW}/teaching/", teaching_body))
print("wrote teaching.html")
