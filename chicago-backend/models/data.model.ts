import mongoose, { Schema, Document } from 'mongoose';
import SocketService from '../utils/socket';

export interface IHomepageContent extends Document {
  [key: string]: any;
}

const HomepageContentSchema: Schema = new Schema({
  heroSection: { type: Schema.Types.Mixed },
  mainHeroSection: { type: Schema.Types.Mixed },
  headerSection: { type: Schema.Types.Mixed },
  footerSection: { type: Schema.Types.Mixed },
  processSection: { type: Schema.Types.Mixed },
  travelServiceSection: { type: Schema.Types.Mixed },
  doneRightSection: { type: Schema.Types.Mixed },
  popularVisasSection: { type: Schema.Types.Mixed },
  whyChooseSection: { type: Schema.Types.Mixed },
  comparisonSection: { type: Schema.Types.Mixed },
  testimonialsSection: { type: Schema.Types.Mixed },
  imagePassportSection: { type: Schema.Types.Mixed },
  contactPage: { type: Schema.Types.Mixed },
  visaProcessPage: { type: Schema.Types.Mixed },
  contactUsServicesSection: { type: Schema.Types.Mixed },
  mapSection: { type: Schema.Types.Mixed },
  ukEtaVisaPage: { type: Schema.Types.Mixed },
  singlePageArchiveComponent: { type: Schema.Types.Mixed },
  usPassportPage: { type: Schema.Types.Mixed },
}, {
  timestamps: true,
  strict: false,
});

// Real-time update hooks
HomepageContentSchema.post('save', function (doc) {
  SocketService.emit('homepage-updated', doc);
});

HomepageContentSchema.post('findOneAndUpdate', async function (doc) {
  // If the query was successful and returned a document
  if (doc) {
    SocketService.emit('homepage-updated', doc);
  } else {
    // In case new: true wasn't set or it's a null record, 
    // we fetch the latest (since it's a single record collection)
    const latest = await mongoose.model('HomepageContent').findOne();
    SocketService.emit('homepage-updated', latest);
  }
});

HomepageContentSchema.post('deleteMany', function () {
  SocketService.emit('homepage-updated', null);
});

export default mongoose.models.HomepageContent || mongoose.model<IHomepageContent>('HomepageContent', HomepageContentSchema);
