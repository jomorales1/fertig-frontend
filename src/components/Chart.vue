<script>
import { Line, mixins } from 'vue-chartjs'
const { reactiveData } = mixins
export default {
  name: 'Chart',
  extends: Line,
  mixins: [reactiveData],
  props:{labelsSet:{
    Type: Array,
      required: true,
      default: null
  },dataSet:{
    Type:Array,
      required: true,
      default: null
    }},
  data(){
    return{
      options: {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            },
            gridLines: {
              display: true
            }
          }],
          xAxes: [ {
            gridLines: {
              display: false
            }
          }]
        },
        legend: {
          display: true
        },
        responsive: true,
        maintainAspectRatio: false
      }
    }
  },
  methods:{

  },
  mounted () {
    this.renderChart(this.datacollection, this.options)
  },
  computed:{
  }

}
</script>

<!--<style>-->
<!--.small {-->
<!--  max-width: 600px;-->
<!--  margin:  150px auto;-->
<!--}-->
<!--</style>-->