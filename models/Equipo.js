import mongoose from 'mongoose';

const EquipoSchema = new mongoose.Schema({
  teamName: { type: String, required: true },
  game: { type: String, required: true },
  logoUrl: { type: String, required: true },
  equipoUrl: { type: String, required: true },
  instagram: {type: String, required: false },
  twitter: {type: String, required: false },
}, { timestamps: true });

const Equipo = mongoose.models.Equipo || mongoose.model('Equipo', EquipoSchema);

export default Equipo;
