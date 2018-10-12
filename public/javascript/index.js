var app = new Vue({
  el: '#app',
  data: {
    "persos": [{
      "name": "Tamaki Amajiki",
      "body": "Tamaki Amajiki est un élèves de Terminale du lycée Yuei. Il fait partie des trois meilleurs étudiant du lycée...",
      "image": "../theme/img/icon_tamaki.jpg",
      "urlID": "../wiki/tamaki.html"
    }, {
      "name": "Mirio Togata",
      "body": "Mirio Togata est un élève de terminale du Lycée Yuei ayant comme pseudonyme, Lemillion. Il fait partie des ...",
      "image": "../theme/img/icon_mirio.jpg",
      "urlID": "../wiki/mirio.html"
    }, {
      "name": "Toshinori Yagi",
      "body": "Toshinori est le premier héros le plus puissant et le 'symbole de la paix' qui a inspiré toute une génération",
      "image": "../theme/img/icon_yagi.jpg",
      "urlID": "../wiki/yagi.html"
    }, {
      "name": "Himiko Toga",
      "body": "Himiko Toga est une Vilaine qui fait partie de l'Alliance des super-vilains. Elle a rejoint l'organisation ...",
      "image": "../theme/img/icon_toga.jpg",
      "urlID": "../wiki/toga.html"
    }]
  }
});

Vue.component('carousel-component', {
  render: function(createElement) {
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
  data: function() {
    return {
      current: 0
    };
  },
  computed: {
    items: function() {
      return this.$slots.default.filter(function(item) {
        return item.componentOptions !== undefined &&
          item.componentOptions.tag === 'carousel-item';
      });
    }
  },
  methods: {
    decreaseCurrent: function() {
      this.current += this.items.length - 1;
      this.current %= this.items.length;
    },
    increaseCurrent: function() {
      this.current += 1;
      this.current %= this.items.length;
    },
    position: function(index) {
      if (index === this.current) return 0;
      if (index === (this.current + 1) % this.items.length) return 1;
      return -1;
    }
  }
});

Vue.component('carousel-item', {
  render: function(createElement) {
    return createElement('div', {
      class: 'carousel-item'
    }, this.$slots.default);
  }
});

new Vue({
  el: '#app'
});



new Vue({
  el: '#app',
  router,
  created() {
    this.fetchData()
  },
  components: {
    App
  },
  data: {
    results: []
  },
  methods: {
    fetchData() {
      axios.get('./static/water.json').then(response => {
        this.results = response.data
      })
    }
  },
  template: '<App :results="results" />'
})
