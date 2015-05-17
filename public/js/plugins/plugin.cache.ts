/**
 * Created by Ian on 2015/5/15.
 */

    ///<reference path="../../tsd/typings/jquery/jquery.d.ts" />
module RomanySoftPlugins {

    interface CacheServices{
        save():boolean;
        restore():boolean;
        find(key: string, type: string):string;
        findObj(key: string, type: string): any;
        findObjList(type:string): any[];
        update(key: string, type: string, value:string);
        delete(key: string, type: string);
    }

    export class Cache implements CacheServices{
        key: string = "default_key";
        data: any[] = [];

        constructor(key: string){
            this.key = key;
        }

        save():boolean{
            var ls = window.localStorage;
            if(ls){
                var dataStr = JSON.stringify(this.data);
                ls.setItem(this.key, dataStr);
                return true;
            }

            return false;
        }

        restore():boolean{
            var ls = window.localStorage;
            if(ls){
                var dataStr = ls.getItem(this.key);
                if(dataStr){
                    this.data.length = 0;
                    this.data.concat(JSON.parse(dataStr));
                    return true;
                }
            }

            return false;
        }

        findObj(key: string, type: string):any{
            $.each(this.data, function(index, obj){
                if(obj){
                    var _key = obj.key, _value = obj.value, _type = obj.type;
                    if( key === _key && type === _type){
                        return obj;
                    }
                }
            });

            return null;
        }

        findObjList(type:string): any[]{
            var objList = [];
            $.each(this.data, function(index, obj){
                if(obj){
                    var _type = obj.type;
                    if( type === _type){
                        objList.push(obj) ;
                    }
                }
            });

            return objList;
        }

        find(key: string, type: string):string{
            var obj = this.findObj(key, type);
            if(obj) return obj.value;

            return null;
        }

        update(key: string, type: string, value:string){
            var obj = this.findObj(key, type);
            if(obj){
                obj.value = value;
            }else{
                this.data.push({key:key, value:value, type:type})
            }

            this.save();
        }

        delete(key: string, type: string){
            var obj = this.findObj(key, type);
            if(obj){
                this.data.splice($.inArray(obj, this.data), 1);
                this.save();
            }
        }
    }
}