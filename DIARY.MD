# Public version of the website

## Leff website feedbacks v2

Programme:

Leff website feedbacks



- [x] sorting A—Z to work on all pages
- [x] same underline on hover like on the rest of the website for all the links
  - [x] but not in navigation bartem 
- [x] lecturer image
- [x] lecturer "filmmaker" page 
- [x] br element on chrome // nemnogo kostyl no poidet

- [x] programme
  - [x] sidebar navigation
    - [x] alphabet letters shown without boxes
    - [x] underline each letter on hover
    - [x] make “film a-z”, “filmmaker a-z”, “specials” and “date” a simple bullet list (no boxes); underline on hover
  - [x] films a-z: use single-film-card design
  - [x] filmmaker a-z: implement grouping design
  - [x] specials: implement grouping design and provide individual pages for each special
  - [?] filter filmmakers by last name instead of first name
  - [x] make nav-header reveal when scrolling up

- [ ] single film cards
  - [x] links to special blocks
  - [x] reduce card size so at least three cards are visible in a typical window
  - [x] give images a fixed frame so all cards are the same size 
        // im afraid thats impossible because of the volumes of texts
  - [x] follow figma for card typography: larger film title, smaller director name in the bottom list 
        // director name moved to bottom, type size is as is
  - [?] make the card background go black on hover
        // this would imply that card is clickable but card is not clickable 
           and break other conventions that we have towards the links and etc
  - [x] add more spacing on film single pages between main text and the information + ticket text

- [ ] specials
  - [x] font sizes bigger
  - [x] remove explicit counts like “Classics comprises 3 films”; design should imply the number
  - [x] add an “all specials” link/entry
  - [ ] fix behavior where unchecking boxes causes the page to scroll down
  - [x] ensure filters are cleared or visually reset when navigating to another page (boxes should not remain checked)
  - [x] prefer linking to dedicated pages for specials instead of using checkbox filter menus
  - [x] create a plain list of specials as links (no checkboxes)

- [ ] block schedule
  - [x] include the opening event as lecture rascaroli per the block schedule

##
WHATS TO BE DONE:

- [ ] Schedule page
  - [x] data is fetched
  - [ ] styling

- [~] Programme
  - [ ] mobile

- [ ] Films page
  - [x] data is fetched
  - [x] images
  - [x] styling
    - [ ] mobile
- [ ] Film pages
  - [x] data is fetched
  - [x] images
  - [x] styling
    - [ ] mobile

- [ ] Filmakers page
  - [x] data is fetched
  - [x] images
  - [x] styling
      - [ ] mobile
- [ ] Filmaker pages
  - [x] data is fetched
  - [?] images
  - [x] styling
      - [ ] mobile

- [ ] Special pages
  - [x] data is fetched
  - [~] images
  - [x] styling
- [ ] Special Block page
  - [x] data is fetched
  - [~] images
  - [x] styling
    - [ ] mobile

- [x] Fix for blocks duration times


- [x] defer offscreen images
- [x] page texts clean up
- [x] alphabetical search to be doing both names
- [x] toggleable filters on the side

### BUGs: 
  - [x]  true one:  http://127.0.0.1:5500/en/programme/filmmakers/elysa-wendi/
        exists:    http://127.0.0.1:5500/en/programme/filmmakers/elysa-wendi-shing-lee/
            BUG:
                its also a problem with url linkage of the images and url page generation
  - [x] language linking between specials that have different names is sometimes broken


## suggestions
- [x] slight gradients for galleries for readability of bright yellow text against different background images
- [x] image counter for galleries
- [x] filters restyle
- [x] film card contains link to director and to film itself
- [x] specials page
- [x] separate individual pages for every specials
? [] get your tickets here section above footer
? [] galleries for directors
? [] should there be separate pages for directors of multiple films?
? [] should there be a link for specials page in each film card?


================================================

FEEDBACK IS NOW DONE AND WEBSITE IS LIVE ALL GOOD 

Agree to the terms / Stem in met de voorwaarden

[x] footer email sign up all in dutch 

[x] First version is planned to go live on 11th of august

Second version is planned to go live on 22 of august

---

## PENDING CHANGES
- [~] revised footer
- [x] texts
- [x]  privacy update
  - [x] EN
  - [x]  NL
- [x] new font with ligature in `.woff2` format

---

## TEST

- [x] production test `fbfa6549d5f5f409d25b1ff4bbaf8e45d32f3f2f`

- [x] double check
  - [x] programme 
  - [x] schedule
  - [x] locations
  - [x] tickets
  - [x] about / festival
  - [x] about / organisation
  - [x] menu
  - [x] privacy

---

## TEXTS

TEXTS UPDATE:
- EN:
  - [x] about festival
  - [x] about organisation
  - [x] tickets
  - [x] locations
  - [x] schedule
  - [x] programme
  - [x] index
- NL:
  - [x] about festival
  - [x] about organisation
  - [x] tickets
  - [x] locations
  - [x] schedule
  - [x] programme
  - [x] index

---

## General Site Issues

- [x] email signup
- [x] add locaties/venues pages
- [x] the font size is not the same on all pages, we prefer the smaller font size as in the 'about' section
- [x] all: naming of page titles
- [x] about/organisation: team capitalize 
- [x] change font size
- [x] pulsating cursor to be different // could be better tho

---

## HOME PAGE

- [x] index: new look

### Carousel
- [x] 8 second carousel
- [x] different images in carousel, available in spreadsheet

### Content Updates
- [x] Add: Leiden Essay Film Festival [on the place of the text next to leff?]
- [x] Add to the front page: Cinema Kijkhuis & Museum De Lakenhal

### Text Adjustments
- [x] Home EN/NL: text "leff is the first festival dedicated et cetera": the font of this text can be a fraction smaller (on both our telephones with different sizes)
- [x] Home: I forgot to mention that the hyphen seems connected to '14': 14-16 September 2025
- [x] text next to leff
  - **NL:** Het eerste festival in Nederland volledig gewijd aan de essayfilm
  - **EN:** The first festival in the Netherlands dedicated entirely to the essay film

---

## MENU
- [x] programme filters are yet to be introduced
- [x] Locations instead of Venues
- [x] Over should be Over leff
- [x] About should be About leff
- [x] Schema. Change into:
- [x] rename: Blokkenschema
- [x] rename: Block schedule

- [x] NL links naming:
  -   Home
  -   Programma 2025
  -   A—Z films
  -   A—Z filmmakers
  -   Tijd
  -   Locatie

---

## PROGRAMME PAGE

### Content Updates
- [x] Delete: Jean-Pierre Bekolo. Add Vincent Meessen. If you like: add Susanna Tomassini

### Text Formatting
- [x] Programme EN/NL: Erik will suggest a slightly adjusted text for the 3rd paragraph with an extra line in between as it looks long now for a mobile version. I will do that a.s.a.p.
- [ ] Programme EN/NL: The dates could be highlighted, for instance by underlining them or make them bold (and perhaps the times too)?
- [x] Programme EN/NL: the font of this text can be smaller, we prefer the font size of the 'about' section

---

## SCHEDULE PAGE

- [x] Ook het blokkenschema maken we bekend op 22 augustus
- [x] Schedule EN/NL: also here we think the font can be smaller, and the same size as the font of the 'about' section

---

## ABOUT PAGE

### Text Formatting
- [x] 2nd paragraph, please some font size as the third and fourth paragraph
- [x] Last paragraph: could this be two paragraphs by using a hard return before 'Deze editie van leff ontsluit …'
- [x] Last paragraph: could this be two paragraphs by using an extra hard return before 'This first edition of leff presents …' So add an extra line
- [x] About - festival EN/NL: I will suggest an extra line for the 3rd and 4th paragraph, to make shorter paragraphs, which makes the texts look more accessible

---

## ORGANISATION PAGE

### Updated Text Content

- [x] **NL:**
```leff is een gezamenlijk initiatief. Naar een idee van de Academy of Creative and Performing Arts van de Universiteit Leiden werd de Discursive Film Foundation opgericht, die is versterkt door het lectoraat FILM van de Hogeschool der Kunsten Den Haag en ReCNTR, een platform dat zich richt op de integratie van audiovisuele onderzoeksmethoden in de wetenschappen. leff is partner van en maakt deel uit van de Days of Art & Science. We Are Public, Cineville, LIFF (Leiden International Film Festival), Leiden Global helpen ons een breed publiek te bereiken.```

- [x] **EN:**
```leff is a joint initiative. Based on an idea by the Academy of Creative and Performing Arts at Leiden University, the Discursive Film Foundation was established, which was joined by the lectorate FILM of the University of the Arts The Hague and ReCNTR, a platform focusing on the integration of audiovisual research methods in the sciences. leff is a partner of and part of the Days of Art & Science. We Are Public, Cineville, LIFF (Leiden International Film Festival), Leiden Global help us reach a wide audience.```

---

## TICKETS PAGE

- [x] Can you delete "inclusief opening". We don't know if we can offer this for everyone
- [x] Can you delete "including the opening event". We don't know if we can offer this for everyone
- [x] We will hear soon if tickets will be available through Cineville

---

## MOBILE

- [x] mobile adaptation
  - [~] index
  - [x] footer

- [x] double check
