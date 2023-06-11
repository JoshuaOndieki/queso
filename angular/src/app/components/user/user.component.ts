import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, map, take } from 'rxjs';
import { User } from '@firebase/auth-types';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { Iuser } from 'src/app/interfaces';
// import {FieldPath} from '@angular/fire/compat/firestore'
import firebase from 'firebase/compat/app';
import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { FormsModule } from '@angular/forms';


interface Ichange  {
    section?:number
    part?:number
    event:any
}


@Component({
    selector: 'app-user',
    standalone: true,
    imports: [CommonModule, DragDropModule, FormsModule],
    templateUrl: './user.component.html',
    styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
    user$!:Observable<Iuser | undefined>
    authUser$!:Observable<User | null>
    id!:string
    answerDoc!:AngularFirestoreDocument<any>
    answer$!:Observable<any | undefined>
    answerSections!:any
    feedbacksDoc!:AngularFirestoreDocument<any>
    feedbacks$!:Observable<any | undefined>
    
    usersCol!:AngularFirestoreCollection<Iuser>
    users$!:Observable<Iuser[] | null>
    users!:Iuser[]

    previewResponse = ''

    nav: 'sections' | 'preview' = 'sections'

    @ViewChild('feedback') feedbackEl!: ElementRef

    constructor(private router:Router, private route:ActivatedRoute, private auth:AngularFireAuth, private firestore:AngularFirestore, private renderer:Renderer2) {
    }

    scrollToBottom() {
        this.renderer.setProperty(
          this.feedbackEl.nativeElement,
          'scrollTop',
          this.feedbackEl.nativeElement.scrollHeight
        );
      }

    ngOnInit(): void {
        this.route.params.subscribe(
            params => {
                this.id = params['id']
                this.user$ = this.firestore.collection('users').doc<Iuser>(this.id).valueChanges()
                this.authUser$ = this.auth.authState
                this.answerDoc = this.firestore.collection('answers').doc<any>(this.id)
                this.answer$ = this.answerDoc.valueChanges()
                this.answer$.subscribe(answer => {
                    this.previewResponse = ''
                    answer.sections.map((section:any) => section.parts.map((part:any) => this.previewResponse += part.content + '\n'))
                    console.log(typeof this.previewResponse);
                    
                })
                this.feedbacksDoc = this.firestore.collection('feedbacks').doc<any>(this.id)
                this.feedbacks$ = this.feedbacksDoc.valueChanges()

                this.usersCol = this.firestore.collection<Iuser>('users')
                this.users$ = this.usersCol.valueChanges()

                this.users$.subscribe(users => this.users = users ? users : [])

                this.feedbacks$.subscribe(feedbacks => this.feedbackEl ? this.scrollToBottom() : '')
            }
        )
    }

    addSection() {
        this.answerDoc.get().subscribe((docSnapshot) => {
            this.answerSections = docSnapshot.get('sections') || [];

            const updatedSections = [...this.answerSections, {
                description: 'edit section description here'}]
    
            this.answerDoc.set({
                sections: updatedSections
            }, {merge: true})
            .then(() => {
                console.log('Section added successfully.');
              })
              .catch((error) => {
                console.error('Error adding section:', error);
              });
        })

    }

    addPart(index:number) {
        this.answerDoc.get().subscribe((docSnapshot) => {
            this.answerSections = docSnapshot.get('sections') || [];
            
            const updatedParts = [...this.answerSections[index]['parts'] || [], {description: 'edit part description here', content:'edit content here'}]

            this.answerSections[index]['parts'] = updatedParts
    
            this.answerDoc.set({
                sections: this.answerSections
            }, {merge: true})
            .then(() => {
                console.log('part added successfully.');
              })
              .catch((error) => {
                console.error('Error adding part:', error);
              });
        })
    }

    drop(event:CdkDragDrop<any[]>, ans:any, type:'section' | 'part', section:number|null=null) {
        // console.log(event.previousContainer === event.container, type, section);
        
        console.log('before', ans);
        
        if (event.previousContainer === event.container && type === 'section') {
            this.answer$.pipe(take(1)).subscribe(answer => {
                moveItemInArray(answer.sections, event.previousIndex, event.currentIndex)
                console.log('after', ans);
                this.answerDoc.set(answer)
            })
        } else if (event.previousContainer === event.container && type === 'part' && section !== null) {  
            console.log(event.previousIndex, event.currentIndex);
                      
            this.answer$.pipe(take(1)).subscribe(answer => {
                // console.log('before', answer);
                moveItemInArray(answer.sections[section].parts, event.previousIndex, event.currentIndex)
                // answer.sections[section].parts = this.moveItem(answer.sections[section].parts, event.previousIndex, event.currentIndex)
                
                // console.log(event.container.data);
                //  = event.container.data
                // console.log(answer);
                this.answerDoc.set(answer)

                console.log('after', ans);
                
                
                // console.log('after', answer);
                // console.log(event.previousIndex, event.currentIndex);
                
            })
        }
        else{
            console.log('diff container');
            // console.log(event.previousIndex, event.currentIndex);
            this.answer$.pipe(take(1)).subscribe(answer => {
                transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex)
                // answer.sections[section!].parts = event.previousContainer.data
                // answer.sections[event.container.id]
                
                // console.log(event.container.id);
                
                console.log('after', ans);
                
                
                
            })
        }
    }

    shareFeedBack(comment:any, by:string) {
        this.feedbacksDoc.get().subscribe((docSnapshot) => {
            const currentFeedbacks = docSnapshot.get('feedbacks') || [];

            const updatedFeedBacks = [...currentFeedbacks || [], {
                comment:comment.value,
                by,
                on: (new Date()).toLocaleString()
            }]
    
            this.feedbacksDoc.set({
                feedbacks: updatedFeedBacks
            }, {merge: true})
            .then(() => {
                console.log('feedback shared successfully.');
                comment.value = ''
              })
              .catch((error) => {
                console.error('Error sharing feedback:', error);
              });
        })

    }

    getUserInfo(uid:string) {
        return this.users.find(user => user.uid === uid)
    }

    moveItem(array:any[], oldIndex:number, newIndex:number) {
        // Copy the array to avoid mutating the original
        const copy = [...array];
        // Remove the item from the old index
        const removed = copy.splice(oldIndex, 1);
        // Insert the item at the new index
        copy.splice(newIndex, 0, ...removed);
        // Return the new array
        return copy;
      }
    
    onChange(type: 'sec-desc' | 'part-desc' | 'part-content', data:Ichange ) {
        console.log('change');
        
        switch(type) {
            case 'part-content':
                // content string
                // 
                this.answerDoc.get().subscribe((doc) => {
                    const documentData = doc.data();
                    documentData.sections[data.section!].parts[data.part!].content = data.event.target.value

                    this.answerDoc.set(documentData)

                    this.toggleEditMode(data.event)
                })
                break;
            case 'part-desc':
                this.answerDoc.get().subscribe((doc) => {
                    const documentData = doc.data();
                    documentData.sections[data.section!].parts[data.part!].description = data.event.target.value

                    this.answerDoc.set(documentData)

                    this.toggleEditMode(data.event)
                })
                break;
            case 'sec-desc':
                this.answerDoc.get().subscribe((doc) => {
                    const documentData = doc.data();
                    documentData.sections[data.section!].description = data.event.target.value

                    this.answerDoc.set(documentData)

                    this.toggleEditMode(data.event)
                })
                break;
            default:
                break;
        }
    }

    toggleEditMode(event:any) {
        this.authUser$.pipe(take(1)).subscribe(user => {
            if (user && user.uid === this.id) {
                event.target.setAttribute("contenteditable", !(JSON.parse(event.target.getAttribute("contenteditable"))))
                event.target.hasAttribute("readonly") ? event.target.removeAttribute("readonly", ) : event.target.setAttribute("readonly", "")
                event.target.classList.toggle("edit-mode");
            }
        })
    }

    changeNav() {
        this.nav = this.nav === 'sections' ? 'preview' : 'sections'
    }

    delete(type: 'section' | 'part', data:any) {
        switch (type) {
            case 'section':
                this.answerDoc.get().subscribe((doc) => {
                    const documentData = doc.data();
                    documentData.sections.splice(data.sectionIndex,1)
                    this.answerDoc.set(documentData)
                })
                break;
            case 'part':
                this.answerDoc.get().subscribe((doc) => {
                    const documentData = doc.data();
                    documentData.sections[data.sectionIndex!].parts.splice(data.partIndex,1)
                    this.answerDoc.set(documentData)
                })
                break;
            default:
                break;
        }
    }

}
