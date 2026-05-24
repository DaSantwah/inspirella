import styles from "./comunidad.module.css";
import { Mail, Briefcase, Camera, Music, PenTool } from "lucide-react";

export default function ComunidadPage() {
  const members = [
    {
      id: 1,
      name: "Elena Torres",
      role: "Directora de Fotografía",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
      icon: <Camera size={18} />
    },
    {
      id: 2,
      name: "Sofía Martínez",
      role: "Artista Visual & Animadora",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
      icon: <PenTool size={18} />
    },
    {
      id: 3,
      name: "Daniela Ruiz",
      role: "Compositora Musical",
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
      icon: <Music size={18} />
    },
    {
      id: 4,
      name: "Laura Gómez",
      role: "Productora Independiente",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
      icon: <Briefcase size={18} />
    }
  ];

  return (
    <div className={styles.container}>
      <div className={styles.backgroundBlobs}>
        <div className={styles.blob1}></div>
        <div className={styles.blob2}></div>
        <div className={styles.blob3}></div>
      </div>

      <div className={styles.content}>
        <div className={styles.header}>
          <h1>La Comunidad Inspirella</h1>
          <p>Conecta con creadoras, comparte ideas y haz networking en un espacio diseñado para la colaboración.</p>
        </div>

        <div className={styles.grid}>
          {members.map(member => (
            <div key={member.id} className={styles.glassCard}>
              <div className={styles.avatarWrapper}>
                <img src={member.avatar} alt={member.name} />
              </div>
              <div className={styles.info}>
                <h3>{member.name}</h3>
                <div className={styles.role}>
                  {member.icon}
                  <span>{member.role}</span>
                </div>
                <button className={styles.connectBtn}>
                  <Mail size={16} /> Conectar
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.joinSection}>
          <div className={styles.glassPanel}>
            <h2>¿Quieres unirte al directorio?</h2>
            <p>Inspirella es una red en crecimiento. Crea tu perfil para que otras artistas puedan encontrarte.</p>
            <button className={styles.primaryBtn}>Crear mi perfil</button>
          </div>
        </div>
      </div>
    </div>
  );
}
