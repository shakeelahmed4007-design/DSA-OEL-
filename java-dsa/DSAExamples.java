import java.util.*;
public class DSAExamples {
 public static void main(String[] args){
  Queue<String> queue=new LinkedList<>(); queue.add("Ali"); queue.add("Sara");
  Stack<String> stack=new Stack<>(); stack.push("Registration"); stack.push("Treatment");
  PriorityQueue<String> pq=new PriorityQueue<>();
  pq.add("Critical"); pq.add("High"); pq.add("Low");
  LinkedList<String> history=new LinkedList<>(); history.add("Registered"); history.add("Assigned");
  System.out.println("Queue: "+queue); System.out.println("Stack: "+stack);
  System.out.println("Priority Queue: "+pq); System.out.println("Linked List: "+history);
 }
}