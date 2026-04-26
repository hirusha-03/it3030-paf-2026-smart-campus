package com.smart.backend.Notification.repo;

import com.smart.backend.Notification.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {

    //Get all notifications for a user ordered by newest first
    List<Notification> findByUserUserIdOrderByCreatedAtDesc(int userId);

    //Count unread notifications
    long countByUserUserIdAndReadFalse(int userId);

    //Mark all as read for a user
    @Modifying
    @Query("UPDATE Notification n SET n.read = true WHERE n.user.userId = :userId")
    void markAllAsReadByUserId(int userId);
}
