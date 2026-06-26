export default function PromoBanner() {
  return (
    <div className="relative w-full rounded-[2rem] overflow-hidden shadow-lg bg-gradient-to-r from-green-600 to-mf-green h-32 md:h-48 flex items-center p-6 md:p-10 mb-8 transition-transform hover:scale-[1.01]">
      
      {/* Imagen de fondo con opacidad baja para que sea un detalle */}
      <img 
        src="https://images.unsplash.com/photo-1610832958506-aa56368176cf?q=80&w=2070&auto=format&fit=crop" 
        className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-overlay"
        alt="Promo Fondo"
      />

      {/* Contenido de texto */}
      <div className="relative z-10 text-white w-full">
        <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm rounded-lg text-[10px] md:text-xs font-black uppercase tracking-widest mb-2 border border-white/30">
          Promoción Especial
        </span>
        <h3 className="font-black text-2xl md:text-4xl leading-none mb-1 md:mb-2 drop-shadow-md">
          ¡Cosecha del Día! 👨‍🌾
        </h3>
        <p className="font-medium text-sm md:text-lg opacity-90 drop-shadow-sm">
          Productos frescos directos del campo a tu mesa.
        </p>
      </div>
      
    </div>
  )
}