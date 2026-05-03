const slides = [

    {
        image: "imagenes/caja-registradora.png",
        title: "Sistema de ventas personalizado",
        description: "Creamos la pagina web de tu negocio en base a las necesidades."
    },

    {
        image: "imagenes/cerrar-con-llave.png",
        title: "Seguridad Digital",
        description: "Protegemos la información de tu empresa mediante soluciones de seguridad y respaldo."
    },

    {
        image: "imagenes/nubes.png",
        title: "CRM y Gestión",
        description: "Organiza clientes, ventas y seguimiento en un solo sistema centralizado."
    },

    {
        image: "imagenes/automatizacion.png",
        title: "Automatización",
        description: "Automatizamos procesos repetitivos para ahorrar tiempo y mejorar productividad."
    },

    {
        image: "imagenes/reporte.png",
        title: "Mantenimiento y soporte",
        description: "Brindamos soporte técnico y mantenimiento continuo para asegurar el correcto funcionamiento de tus sistemas."
    }

];

let current = 0;

function changeSlide(){

    current++;

    if(current >= slides.length){
        current = 0;
    }

    document.getElementById("slideimg").src =
    slides[current].image;

    document.getElementById("slideh2").textContent =
    slides[current].title;

    document.getElementById("slidedescription").textContent =
    slides[current].description;
}

setInterval(changeSlide, 3000);