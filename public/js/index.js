Vue.prototype.$http = axios

Vue.component("navbar", {
  template: navbar,
  data:
  () => ({
    el: '#app',
    admin: "",
  }),
  methods:
  {
    isAdmin() {
      axios.get('/connected').then((isconnected) => {
        if (isconnected.data.admin) {
          this.admin = isconnected.data.admin
        } else {
          this.admin = false
        }
      });
    }
    ,
    ready() {
      this.isAdmin()
      setInterval(function () {
        this.isAdmin()
      }.bind(this), 30000)
    }
  },
  created() {
    this.ready();
  }
});

Vue.component("footer-bar", {
  template:
  footer,
  data:
  () => ({
    el: '#app',
    random: 0,
    quote: "",
    quotes: [],
  }),
  methods:
  {
    loadQuotes() {
      axios.get('/api/quotes').then((response) => {
        this.quotes = response.data
        this.random = Math.floor(Math.random() * this.quotes.length);
        this.quote = this.quotes[this.random];
      });
    },
    ready() {
      this.loadQuotes()
      setInterval(function () {
        this.loadQuotes()
      }.bind(this), 30000)
    }
  },
  created() {
    this.ready();
  }
});

Vue.component('carousel-component', {
  render: function (createElement) {
    return createElement('div', {
      class: 'carousel-component'
    },
    this.items.map((item, index) =>
    createElement('div', {
      'class': 'carousel-page' + (this.current === index ?
        ' active' : ''),
        style: {
          transform: `translate3d(${this.position(index) * 100}%, 0, 0)`,
        }
      }, [item])
    ).concat([
      createElement('button', {
        'class': 'carousel-nav-prev',
        on: {
          click: () => {
            this.decreaseCurrent();
          }
        }
      }, 'Prev'),
      createElement('button', {
        'class': 'carousel-nav-next',
        on: {
          click: () => {
            this.increaseCurrent();
          }
        }
      }, 'Next')
    ])
  );
},
data: function () {
  return {
    current: 0
  };
},
computed: {
  items: function () {
    return this.$slots.default.filter(function (item) {
      return item.componentOptions !== undefined &&
      item.componentOptions.tag === 'carousel-item';
    });
  }
},
methods: {
  decreaseCurrent: function () {
    this.current += this.items.length - 1;
    this.current %= this.items.length;
  },
  increaseCurrent: function () {
    this.current += 1;
    this.current %= this.items.length;
  },
  position: function (index) {
    if (index === this.current) return 0;
    if (index === (this.current + 1) % this.items.length) return 1;
    return -1;
  }
}
});

Vue.component('carousel-item', {
  render: function (createElement) {
    return createElement('div', {
      class: 'carousel-item'
    }, this.$slots.default);
  }
});


let vue = new Vue({
  el: '#app',
  data: {
    persos: [],
    quotes: [],
    username: "",
    password: "",
    random: 0,
    quote: "",
    admin: "",
    pseudo_perso: "",
    selectedPerso: -1
  },
  methods: {
    loadData() {
      axios.get('/api/persos').then((response) => {
        this.persos = response.data
      });

      axios.get('/api/quotes').then((quoquo) => {
        this.quotes = quoquo.data
      });

      axios.get('/connected').then((isconnected) => {
        if (isconnected.data.admin) {
          this.admin = isconnected.data.admin
        } else {
          this.admin = false
        }
      });
    },
    delete_quote(quote) {
      axios.post('/api/quotes/delete', {
        "quote": quote
      }).then((response) => {
        window.location.href = '/administration'
      })
    },
    delete_perso(pseudo) {
      axios.post('/api/perso/delete', {
        "pseudo": pseudo.split(' ').join('').toLowerCase()
      }).then((response) => {
        window.location.href = '/administration'
      });
    },
    redirection_update(pseudo) {
      window.location.href = "/update?pseudo_perso=" + pseudo.split(' ').join('').toLowerCase()
    },
    redirection(pseudo) {
      window.location.href = "/detail?pseudo_perso=" + pseudo.split(' ').join('').toLowerCase()
    },

    ready() {
      this.loadData()
      setInterval(function () {
        this.loadData()
      }.bind(this), 30000)
    },

    hoverCard(selectedIndex) {
      this.selectedPerso = selectedIndex
      this.animateCards()
    },
    animateCards() {
      this.persos.forEach((perso, index) => {
        const direction = this.calculateCardDirection(index, this.selectedPerso)
        TweenMax.to(
          this.$refs[`card_${index}`],
          0.3,
          {x: direction * 50}
        )
      })
    },
    calculateCardDirection(cardIndex, selectedIndex) {
      if (selectedIndex === -1) {
        return 0
      }

      const diff = cardIndex - selectedIndex
      return diff === 0 ? 0 : diff / Math.abs(diff)
    },
    isSelected(cardIndex) {
      return this.selectedPerso === cardIndex
    }
  },
  mounted: function () {
    this.ready();
  },
  created: function () {
    var urlParams = new URLSearchParams(window.location.search);

    var pseudo_perso = urlParams.get('pseudo_perso');
    this.pseudo_perso = pseudo_perso;
  }
});
