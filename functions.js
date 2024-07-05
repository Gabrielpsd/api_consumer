const app = Vue.createApp({
  data() {
    return {    
        existImage: true,
        images: [
        ],
        busca : 
            [
                {searchEngine:"google"},
                {query:""},
                {imgsz: ""},
                {quantity: 20}
            ],
        classSearch: "okay",
        showClassShow: false,
        existImage: false,
        mostrarBotaoBaixar: false,
        quantidadeSelecionada: 0
    }
  },
  methods:{
    selectButtom(image)
    {
        image.selected = !image.selected

        if (image.selected == true)
        {
            this.quantidadeSelecionada ++;
            this.mostrarBotaoBaixar = true;

        }
        else
        {
            this.quantidadeSelecionada --;
            if(this.quantidadeSelecionada == 0)
            {
                this.mostrarBotaoBaixar = false;
            }
        }
    },
    printJson()
    {
        if (this.busca.query == undefined || this.busca.query == "")
        {
            this.classSearch = "notOkay";
            this.showClassShow = true;
        }
        else
        {   
            this.showClassShow = false;
            this.classSearch = "";
            let busca = 
            {
                "searchEngine":"google",
                "query":this.busca.query,
                "imgsz":this.busca.imgsz,
                "quantity": 20
            }

            requestToAPI(busca, this);
        }
    },
    downloadImages()
    {   
        index = 0;
        this.images.forEach(element => {
            console.log(element["image"])
            if(element["selected"] == true)
            {
                console.log("entrei aqui")
                /* const link = document.createElement("a");
                link.href = element["image"];
                link.download = "Image-"+ index;
                link.style.display = 'none';
                link.click(); 
                index++; */
                axios({
                    url: element["image"],
                    method: 'GET',
                    responseType: 'blob'
              })
                    .then((response) => {
                          const url = window.URL
                                .createObjectURL(new Blob([response.data]));
                          const link = document.createElement('a');
                          link.href = url;
                          link.setAttribute('download', "iamgem-"+index+".jpg");
                          document.body.appendChild(link);
                          link.click();
                          document.body.removeChild(link);
                    })

                index++;
            } 
        });

        /* for(var image in this.images)
        {   

            console.log(image[index].valueOf())
            console.log(image["select"])
            console.log(image)
             if(value["select"] == true)
            {
                console.log("entrei aqui")
                const link = document.createElement("a");
                link.href = URL.createObjectURL(value["images"]);
                link.download = "Image-{}".format(index);
                link.click(); 
                index++;
            } 
        } */
    }
  }
}).mount('#app')


function requestToAPI(data, obj)
{
    const search = JSON.stringify(data);

    console.log(search)
    fetch("http://127.0.0.1:5000/photos",{
        method: "POST",
        body: search,
    }
    ).then(function(response){
        return response.json();
    }).then(function(data){
        obj.images = [];
        obj.existImage = true;
        for(const [key,value] of Object.entries(data["imagesLinks"]))
        {
           obj.images.push({image:value,selected:false})
        }
    })
}