Updated pages for users.ox.ac.uk/~pemb6003
==========================================

Five HTML files that replace the existing ones of the same name. Content matches
https://danielgrimmer.github.io (the primary site) as of August 2026.

REPLACE THESE FIVE FILES
------------------------
  index.html      Home — bio, research interests, selected papers
  about.html      Longer career narrative
  papers.html     Publications
  talks.html      Talks, posters, research visits
  teaching.html   Teaching

NOTHING ELSE NEEDS TO CHANGE
----------------------------
The pages still point at the files already on the server, under the same names
and paths:

  CVGrimmer.pdf                       (see below — this one should be refreshed)
  DGrimmer2.jpg, DGrimmer3.jpg        photos, unchanged
  TalksAndPosters/*.pdf               talk slides, unchanged
  SoccerHockey/, EscherChess/         games, unchanged

ONE FILE TO REFRESH
-------------------
  CVGrimmer.pdf — please upload the current CV over the existing file, keeping
  the same filename so the "Long CV" link keeps working.

WHAT CHANGED IN THESE PAGES
---------------------------
  * Job title is now "Postdoctoral Associate in Philosophy, Yale University"
    (previously "Postdoctoral Researcher").
  * Publications restructured to 2 under review, 18 peer-reviewed, and a new
    "Unpublished Preprints" section of 5.
  * Talks updated through 2026, with an upcoming APA Eastern talk added.
  * Teaching updated, including two Oxford tutorials that were missing.
  * An ORCID link added to the header.
  * Each page carries <link rel="canonical"> pointing at the corresponding page
    on danielgrimmer.github.io, so search engines treat that as the primary
    copy rather than penalising the two sites as duplicates. Remove those four
    lines if that is not wanted.
  * Some invalid CSS in the originals was corrected — several colours were
    missing their leading "#", a "float: fixed" was not a real value, and a few
    tags were left unclosed. The pages look the same, just valid now.
