import { ObjectID } from 'mongodb'

import { post, pre, prop, Typegoose } from '@typegoose/typegoose'

@pre<CommonEntity>('save', function(next) {
  if (!this.create_at) {
    this.create_at = Date.now()
  }
  this.update_at = Date.now()

  this.id = this._id
  next()
})
@post<CommonEntity>('update', function() {
  this.update_at = Date.now()
})
export class CommonEntity extends Typegoose {
  @prop({ select: false })
  __v: number

  // @prop({ select: false })
  // _id: ObjectID

  @prop({ index: true })
  id: ObjectID

  @prop({})
  create_at: number

  @prop({})
  update_at: number
}
