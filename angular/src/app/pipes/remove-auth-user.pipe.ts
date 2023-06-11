import { Pipe, PipeTransform } from '@angular/core';
import { Iuser } from '../interfaces';
import { User } from '@firebase/auth-types';

@Pipe({
  name: 'removeAuthUser',
  standalone: true
})
export class RemoveAuthUserPipe implements PipeTransform {

  transform(users: Iuser[], authUser: User): Iuser[] {
    if (!users.length) {
      return []
    }

    return users.filter((user:Iuser) => {
      return user.uid !== authUser.uid
    })

  }

}
