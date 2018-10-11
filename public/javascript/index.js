var app = new Vue({
  el: '#app',
  data: {
    random: 0,
    quote: "",
    quotes: ['"All men are not created equal." ━ Izuku Midoriya',
      '"Maybe I failed this time, but I’m not giving up." ━ Shinsou Hitoshi',
      '"Dreams can become reality!" ━ Izuku Midoriya',
      '"The most inflated egos are often the most fragile." ━ All Might',
      '"Stop Talking, I will win. That’s… what heroes do." ━ Bakugou Katsuki',
      '"Isn’t it a hero’s job to save people?" ━ Shoto Todoroki',
      '"Heroes and villains both thrive on violence, but we’re still categorized. “You’re good” “You’re evil”." ━ Shigaraki Tomura',
      '"The most inflated egos are often the most fragile." ━ All Might',
      '"Whether you win or lose, looking back and learning from your experience is a part of life." ━ All Might',

    ],
  },

  methods: {
    ready: function() {
      this.random = Math.floor(Math.random() * this.quotes.length) + 0;

      this.quote = this.quotes[this.random];
      this.person = this.persons[this.random];
    }
  },
  mounted() {
    this.ready();
  }


})
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
