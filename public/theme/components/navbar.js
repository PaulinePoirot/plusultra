const navbar =
`<div class="navbar">
  <nav>
  <div class="nav-wrapper blue darken-4">
    <a href="/" class="brand-logo">&nbsp;&nbsp;PLUS ULTRA</a>
      <ul class="right hide-on-med-and-down">
        <li><a href="/liste">Personnages</a></li>
        <li v-if='admin==true'><a href="/administration">Administration</a></li>
        <li v-if='admin==true'><a href="/logout">Déconnection <i class="material-icons right">highlight_off</i></a></li>
        <li v-if='admin==false'><a href="../wiki/connexion_page.html">Connexion <i class="material-icons right">account_circle</i></a></li>
      </ul>
      </div>
  </nav>
</div>`;
